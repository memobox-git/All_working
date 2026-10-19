"""Download one month of real New York taxi trips and build taxi.duckdb.

The data is free and public, from the NYC Taxi and Limousine Commission (TLC):
https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page

Run it once:  python get_data.py
"""
from pathlib import Path
import urllib.request

import duckdb

HERE = Path(__file__).parent
TRIPS = HERE / "yellow_tripdata_2024-01.parquet"
ZONES = HERE / "taxi_zone_lookup.csv"
DB_FILE = HERE / "taxi.duckdb"

DOWNLOADS = {
    TRIPS: "https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2024-01.parquet",
    ZONES: "https://d37ci6vzurychx.cloudfront.net/misc/taxi_zone_lookup.csv",
}

# Column notes, copied from the TLC data dictionary (18 March 2025), so the
# agent can read them the same way you would.
NOTES = {
    "trips.VendorID": "A code indicating the TPEP provider that provided the record. 1 = Creative Mobile Technologies, LLC; 2 = Curb Mobility, LLC; 6 = Myle Technologies Inc; 7 = Helix",
    "trips.tpep_pickup_datetime": "The date and time when the meter was engaged.",
    "trips.tpep_dropoff_datetime": "The date and time when the meter was disengaged.",
    "trips.passenger_count": "The number of passengers in the vehicle.",
    "trips.trip_distance": "The elapsed trip distance in miles reported by the taximeter.",
    "trips.RatecodeID": "The final rate code in effect at the end of the trip. 1 = Standard rate; 2 = JFK; 3 = Newark; 4 = Nassau or Westchester; 5 = Negotiated fare; 6 = Group ride; 99 = Null/unknown",
    "trips.store_and_fwd_flag": "Y = the trip record was held in vehicle memory before sending to the vendor; N = it was not.",
    "trips.PULocationID": "TLC Taxi Zone in which the taximeter was engaged. Matches zones.LocationID.",
    "trips.DOLocationID": "TLC Taxi Zone in which the taximeter was disengaged. Matches zones.LocationID.",
    "trips.payment_type": "A numeric code signifying how the passenger paid for the trip. 0 = Flex Fare trip; 1 = Credit card; 2 = Cash; 3 = No charge; 4 = Dispute; 5 = Unknown; 6 = Voided trip",
    "trips.fare_amount": "The time-and-distance fare calculated by the meter.",
    "trips.extra": "Miscellaneous extras and surcharges.",
    "trips.mta_tax": "Tax that is automatically triggered based on the metered rate in use.",
    "trips.tip_amount": "Tip amount. This field is automatically populated for credit card tips. Cash tips are not included.",
    "trips.tolls_amount": "Total amount of all tolls paid in trip.",
    "trips.improvement_surcharge": "Improvement surcharge assessed trips at the flag drop.",
    "trips.total_amount": "The total amount charged to passengers. Does not include cash tips.",
    "trips.congestion_surcharge": "Total amount collected in trip for NYS congestion surcharge.",
    "trips.Airport_fee": "For pick up only at LaGuardia and John F. Kennedy Airports.",
    "zones.LocationID": "TLC Taxi Zone ID. Matches trips.PULocationID and trips.DOLocationID.",
    "zones.Borough": "The borough the zone is in.",
    "zones.Zone": "The name of the taxi zone.",
    "zones.service_zone": "The service area the zone belongs to.",
}

for path, url in DOWNLOADS.items():
    if not path.exists():
        print(f"Downloading {path.name} ...")
        urllib.request.urlretrieve(url, path)

DB_FILE.unlink(missing_ok=True)
db = duckdb.connect(str(DB_FILE))
db.sql(f"CREATE TABLE trips AS SELECT * FROM read_parquet('{TRIPS.as_posix()}')")
db.sql(f"CREATE TABLE zones AS SELECT * FROM read_csv('{ZONES.as_posix()}')")
for column, note in NOTES.items():
    note = note.replace("'", "''")
    db.sql(f"COMMENT ON COLUMN {column} IS '{note}'")
db.close()

print(f"Built {DB_FILE.name}: the trips and zones tables are ready.")
