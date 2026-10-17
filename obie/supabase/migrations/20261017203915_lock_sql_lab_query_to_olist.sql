-- Stacklebot is shared with the SQL Lab. Its public RPC execute_sql_lab_query
-- runs SQL as the function owner (SECURITY DEFINER). Owned by postgres, it could
-- read every table in public, including OBIE's and copilot_calls, past RLS.
-- It now runs as sql_lab_reader, a role that can only read the Olist tables.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'sql_lab_reader') then
    create role sql_lab_reader nologin;
  end if;
end $$;

grant sql_lab_reader to postgres; -- needed to hand it the function

grant usage on schema public, olist_source to sql_lab_reader;
grant select on
  public.olist_customers,
  public.olist_sellers,
  public.olist_products,
  public.olist_orders,
  public.olist_order_items,
  public.olist_order_payments,
  public.olist_order_reviews,
  public.product_category_name_translation
to sql_lab_reader;
grant select on all tables in schema olist_source to sql_lab_reader;

-- RLS on every public Olist table. anon and authenticated have no grants on
-- them, so the SQL Lab function is the only way in.
alter table public.olist_orders enable row level security;
alter table public.olist_order_items enable row level security;
alter table public.olist_order_reviews enable row level security;

create policy "SQL Lab reads" on public.olist_customers for select to sql_lab_reader using (true);
create policy "SQL Lab reads" on public.olist_sellers for select to sql_lab_reader using (true);
create policy "SQL Lab reads" on public.olist_products for select to sql_lab_reader using (true);
create policy "SQL Lab reads" on public.olist_orders for select to sql_lab_reader using (true);
create policy "SQL Lab reads" on public.olist_order_items for select to sql_lab_reader using (true);
create policy "SQL Lab reads" on public.olist_order_payments for select to sql_lab_reader using (true);
create policy "SQL Lab reads" on public.olist_order_reviews for select to sql_lab_reader using (true);
create policy "SQL Lab reads" on public.product_category_name_translation for select to sql_lab_reader using (true);

-- A function's owner needs CREATE on its schema at the moment it takes
-- ownership, so grant it just for the hand-over.
grant create on schema public to sql_lab_reader;
alter function public.execute_sql_lab_query(text) owner to sql_lab_reader;
revoke create on schema public from sql_lab_reader;

-- Leftover test sandbox: its owner (authenticated) is unaffected; this only
-- closes it to anyone else.
alter table sandbox_deadbeef0000000000000000000000ff.dim_test enable row level security;
