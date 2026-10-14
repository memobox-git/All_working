# Source facts: data engineering posts (verified)

- **Date read for every item:** 2026-10-14. Some job APIs and pages were read around 04:30 UTC that day.
- **Rule used:** Every number and every quote below was read from the source URL listed with it. Text inside the "VERBATIM" blocks is copied exactly from the posting, including its typos and spacing quirks. Nothing was estimated. Anything I could not verify is marked **NOT VERIFIED**.
- **Source types:**
  - **Official** means the company's own careers site or its applicant tracking system (Greenhouse, Ashby, Workday, Oracle, Eightfold).
  - **Mirror** means a third-party job board that republishes the posting. Its `datePosted` comes from the mirror's JSON-LD `JobPosting` data, and the posting may be closed.
  - **Levels.fyi** means the public company page or job-family page, read directly. No mirror or search snippet was used for these.

---

## Part A: "What [Company] expects from a data engineer"

### A1. OpenAI: Data Engineer, Core Experimentation (Official, live)

| Field | Value |
|---|---|
| Title | Data Engineer, Core Experimentation |
| Team / Dept | Applied AI Engineering / Applied AI. The posting body says "The Statsig team at OpenAI". |
| Location | API location field: "Seattle". Workplace type: Hybrid. The body says "This role is based in Bellevue." |
| Date posted | 2026-10-06 (Ashby `publishedAt` 2026-10-06T20:36:36Z; page JSON-LD `datePosted` "2026-10-06") |
| URL | https://jobs.ashbyhq.com/openai/2796d32a-9f7c-4008-a2c5-50dd53b0f2fe |
| Source read | Ashby public API `https://api.ashbyhq.com/posting-api/job-board/openai?includeCompensation=true`, plus the public page above |

**Responsibilities (VERBATIM, "In this role, you will:")**
- Design, build and manage our data pipelines, ensuring all user event data is seamlessly integrated into our data warehouse.
- Develop canonical datasets to track key product metrics including user growth, engagement, and revenue.
- Work collaboratively with various teams, including, Infrastructure, Data Science, Product, Marketing, Finance, and Research to understand their data needs and provide solutions.
- Implement robust and fault-tolerant systems for data ingestion and processing.
- Participate in data architecture and engineering decisions, bringing your strong experience and knowledge to bear.
- Ensure the security, integrity, and compliance of data according to industry and company standards.

**Qualifications (VERBATIM, "You might thrive in this role if you:")**
- Have 3+ years of experience as a data engineer and 8+ years of any software engineering experience(including data engineering).
- Proficiency in at least one programming language commonly used within Data Engineering, such as Python, Scala, or Java.
- Experience with distributed processing technologies and frameworks, such as Hadoop, Flink and distributed storage systems (e.g., HDFS, S3).
- Expertise with any of ETL schedulers such as Airflow, Dagster, Prefect or similar frameworks.
- Solid understanding of Spark and ability to write, debug and optimize Spark code.

**AI/LLM-related lines (VERBATIM).** The requirements contain no AI/LLM skill requirement. The only AI-related line is in the role description:
> "This role also provides the opportunity to collaborate closely with the researchers behind ChatGPT and help them train new models to deliver to users."

**Pay (VERBATIM).** The posting gives two different ranges:
- In the description text: "Compensation Range: $293K - $325K USD"
- In Ashby's structured compensation field, which is also shown on the public page: "$347K – $385K • Offers Equity". The page JSON-LD `baseSalary` is 347000–385000 USD/year.
- **Flag:** The two ranges disagree, and both appear on the live page. If you cite a number, cite the one in the description text and say the page also shows a second range.

**Context (same board, same day).** OpenAI also has "Data Engineer, Hardware & Consumer Devices" (Consumer Devices, San Francisco, published 2026-10-01, https://jobs.ashbyhq.com/openai/c25fd30e-056e-4a26-af80-7ea1074fc56e). Its structured comp is "$295K – $445K • Offers Equity". The body states: "Prior hardware experience is not required."

---

### A2. Uber: Software Engineer II, Data Infrastructure - AV Labs (Official, live) + Data Engineer - Growth and Marketing Platform (Mirror, 2026, likely closed)

No live posting with "Data Engineer" in the title exists at Uber today. Uber's Oracle Recruiting Cloud API listed **643** live requisitions on 2026-10-14 and **none** had "Data Engineer" in the title. No entry-level or new-grad DE role was live either. Only two engineering titles matched "graduate", "new grad", "university" or "early career": "PhD 2026 Graduate Software Engineer II (AV Labs), United States" and "Graduate 2026 PhD Software Engineer II (AV Labs), United States". Both are PhD software engineering roles, not DE. Two postings are recorded below.

#### A2a. Official, live: closest current data-engineering role

| Field | Value |
|---|---|
| Title | Software Engineer II, Data Infrastructure - AV Labs |
| Team | AV Labs |
| Location | Sunnyvale, CA, United States |
| Date posted | 2026-10-09 (`ExternalPostedStartDate` 2026-10-09T15:33:28Z) |
| URL | https://iaziqy.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/UberCareers/job/302991 (returned HTTP 200). jobs.uber.com/en/jobs/302991/ is behind Cloudflare (403). |
| Source read | Oracle HCM API `https://iaziqy.fa.ocs.oraclecloud.com/hcmRestApi/resources/latest/recruitingCEJobRequisitionDetails?onlyData=true&expand=all&finder=ById;Id="302991",siteNumber=UberCareers` |

**Responsibilities (VERBATIM, "What You'll Do")**
- Build high-throughput pipelines that turn raw vehicle recordings into query-ready datasets, and make them correct under retries, reprocessing, and backfills.
- Design and tune how data is laid out, versioned, and indexed on object storage so reads stay fast as the lake grows.
- Define and evolve schemas and data contracts for heterogeneous sensor and telemetry data.
- Run large batch workloads on distributed compute, and improve their throughput, cost, and failure behavior.
- Own the operational health of what you build: metrics, alerting, on-call, and well-tested code.
- Work with the teams that produce and consume the data to resolve quality issues and roll out changes safely.

**Basic Qualifications (VERBATIM)**
- Bachelor's degree in Computer Science or a related technical field.
- 3+ years of professional software engineering experience building data infrastructure or distributed backend systems.
- Proficiency in Python (or C++/Go) with strong fundamentals in data structures and design.
- Hands-on experience with a distributed processing framework (e.g., Ray, Spark, or Flink).
- Hands-on experience with columnar, object-storage-backed data formats and table formats (e.g., Parquet, Apache Arrow, Iceberg, or Delta).
- Experience with observability tooling for batch systems (Prometheus, Grafana).

**Preferred Qualifications (VERBATIM)**
- Master's degree in Computer Science or a related field.
- Experience tuning storage layouts, compaction, or indexing for read-path performance.
- Experience with robotics or sensor data (ROS 2, MCAP, point clouds, or time-series telemetry).
- Experience running workloads on Kubernetes or a major cloud (OCI, AWS, or GCP).

**AI/LLM lines.** The qualifications have no AI/LLM tool requirement. The context line (VERBATIM): "Autonomy is now a data race—and Uber has an edge: We collect rare, real-world driving data at a scale and capital efficiency no one else can match."

**Pay (VERBATIM):** "For Sunnyvale, CA-based roles: The base salary range for this role is USD $171,000 per year - USD $190,000 per year."

#### A2b. Mirror (2026): role titled "Data Engineer"

| Field | Value |
|---|---|
| Title | Data Engineer - Growth and Marketing Platform |
| Team | Growth and Marketing Platform Data Team |
| Location | San Francisco, CA, USA |
| Date posted | 2026-03-20 (mirror JSON-LD `datePosted` 2026-03-20T21:15:29Z; `validThrough` 2026-06-04) |
| Mirror URL | https://jobs.anitab.org/companies/uber/jobs/71455448-data-engineer-growth-and-marketing-platform (AnitaB.org job board) |
| Official URL | https://www.uber.com/careers/list/140405 redirects to https://jobs.uber.com/en/jobs/140405/, which returned **HTTP 404** on 2026-10-14. The posting is likely closed. |

**What You Will Do (VERBATIM)**
- Design, develop, and maintain scalable data pipelines and backend services for processing large-scale web event analytics.
- Lead the development of core data infrastructure, ensuring high availability, performance, and reliability.
- Solve complex challenges at the intersection of low latency, high correctness, and full determinism.
- Architect and optimize data models, ETL/ELT workflows, and distributed data processing frameworks.
- Participate in code reviews, mentor junior engineers, and enforce best practices in data engineering.
- Diagnose and resolve data quality issues, ensuring accuracy, efficiency, and security.

**Basic Qualifications (VERBATIM)**
- 4+ years of experience in data engineering or backend software development.
- Proficiency in Python, SQL, Java, or Scala for data pipeline development.
- Proficiency in Big Data frameworks (e.g., Spark, Flink, Presto, MapReduce) and distributed computing.
- Data warehouse and Data Modeling experience

**Preferred Qualifications (VERBATIM)**
- Experience in Web and SEO Analytics
- Experience in Marketing Technologies
- Designing and executing on Real-time and Near Real-time Systems

**AI/LLM lines:** None.

**Pay (VERBATIM):** "For San Francisco, CA-based roles: The base salary range for this role is USD$171,000 per year - USD$190,000 per year."

---

### A3. Anthropic: Data Engineer, Product (Official, live)

| Field | Value |
|---|---|
| Title | Data Engineer, Product |
| Team / Dept | Data Science & Analytics |
| Location(s) | San Francisco, CA \| New York City, NY \| Seattle, WA (Location Type: On-Site). Logistics section: "we expect all staff to be in one of our offices at least 25% of the time" |
| Date posted | 2026-10-09 (Greenhouse `first_published` 2026-10-09T13:00:40-04:00) |
| URL | https://job-boards.greenhouse.io/anthropic/jobs/5448481008 |
| Source read | `https://boards-api.greenhouse.io/v1/boards/anthropic/jobs?content=true` |

**Responsibilities (VERBATIM)**
- Understand, and where possible anticipate, the data needs of partner teams, and translate them into data models, reporting and technical requirements
- Define, build and manage key dbt pipelines that turn raw logs into canonical datasets
- Set data integrity standards and SLAs so data is delivered on time and accurately
- Build reliable dashboards that track core metrics and share insights across the company
- Build foundational data products, dashboards and tools that let self-serve analytics scale
- Partner with stakeholders to define and materialize metrics and analysis for new and evolving consumer products
- Shape Product teams' roadmaps from a data systems perspective
- Become an expert in our data models and data architecture

**You may be a good fit if you have (VERBATIM)**
- Significant experience as a Data Engineer or in a similar Data Science & Analytics role, ideally partnering with Product leads to build and report on company-wide metrics
- A passion for Anthropic's mission of building helpful, honest and harmless AI
- Expertise building multi-step ETL jobs with tools like dbt, plus experience with workflow tools like Airflow and version control through GitHub
- Expertise in SQL and Python for turning data into accurate, clean data models
- Experience building reporting and dashboards in tools like Hex that serve multiple cross-functional teams
- A bias for action, and a sense of when "good enough" beats perfect
- An end-to-end mindset: you take ownership of solving a problem fully, even when that means picking up work beyond your usual scope
- Comfort with ambiguity, and a habit of creating clarity and forward progress
- Experience using AI to scale your own productivity and your team's without lowering the quality of the work

**Strong candidates may also have (VERBATIM)**
- Experience building a data engineering (or similar) function from the ground up in an early-stage or fast-growing environment

**AI/LLM-related requirement (VERBATIM):** "Experience using AI to scale your own productivity and your team's without lowering the quality of the work"

**Education (VERBATIM, Logistics):** "Minimum education: Bachelor’s degree or an equivalent combination of education, training, and/or experience"

**Pay (VERBATIM):** "The annual compensation range for this role is listed below." / "Annual Salary: $320,000—$405,000 USD"

**Context:** On 2026-10-14 Anthropic's board listed 5 live roles with "Data Engineer" in the title: Billing & Payments; GTM; Product; Safeguards; Recruiting Analytics Data Engineer.

---

### A4. Databricks: Senior Software Engineer (Data Platform) (Official, live; Bengaluru)

On 2026-10-14 Databricks' Greenhouse board listed **895** jobs and **none** was titled "Data Engineer". Two titles contained "Data Engineering", and neither is a DE role: "Specialist Solutions Architect - Data Engineering & Warehousing (Financial Services)" and "Sr. Product Manager, Data Engineering". The closest DE-equivalent is the internal Data Platform role below. Its only location is India, and it states no pay range.

| Field | Value |
|---|---|
| Title | Senior Software Engineer (Data Platform) |
| Team / Dept | Data Platform team (Greenhouse department: "Engineering - Pipeline") |
| Location | Bengaluru, India |
| Date posted | First published 2024-09-23. Updated 2026-10-03. Still live on 2026-10-14. |
| URL | https://databricks.com/company/careers/open-positions/job?gh_jid=7647369002 |
| Source read | `https://boards-api.greenhouse.io/v1/boards/databricks/jobs?content=true` |

**Role framing (VERBATIM):** "As a Senior Software Engineer working on the Data Platform team you will help build the Data Intelligence Platform for Databricks that will allow us to automate decision-making across the entire company. ... the team also functions as a large, production, in-house customer that dog foods Databricks and guides the future direction of the product."

**The impact you will have (VERBATIM)**
- Design and run the Databricks metrics store that enables all business units and engineering teams to bring their detailed metrics into a common platform for sharing and aggregation, with high quality, introspection ability and query performance.
- Design and run the cross-company Data Intelligence Platform, which contains every business and product metric used to run Databricks. You’ll play a key role in developing the right balance of data protections and ease of shareability for the Data Intelligence Platform as we transition to a public company.
- Develop tooling and infrastructure to efficiently manage and run Databricks on Databricks at scale, across multiple clouds, geographies and deployment types. This includes CI/CD processes, test frameworks for pipelines and data quality, and infrastructure-as-code tooling.
- Design the base ETL framework used by all pipelines developed at the company.
- Partner with our engineering teams to provide leadership in developing the long-term vision and requirements for the Databricks product.
- Build reliable data pipelines and solve data problems using Databricks, our partner’s products and other OSS tools. Provide early feedback on the design and operations of these products.
- Establish conventions and create new APIs for telemetry, debug, feature and audit event log data, and evolve them as the product and underlying services change.
- Represent Databricks at academic and industrial conferences & events.

**What we look for (VERBATIM)**
- 6+ years of industry experience
- 4+ years of experience providing technical leadership on large projects similar to the ones described above - ETL frameworks, metrics stores, infrastructure management, data security.
- Experience building, shipping and operating reliable multi-geo data pipelines at scale.
- Experience working with and operating workflow or orchestration frameworks, including open source tools like Airflow and DBT or commercial enterprise tools.
- Experience with large-scale messaging systems like Kafka or RabbitMQ or commercial systems.
- Excellent cross-functional and communication skills, consensus builder.
- Passion for data infrastructure and for enabling others by making their data easier to access.

**AI/LLM lines:** The requirements contain none. The only mention is in the description: "in collaboration with Databricks Product Teams, Data Science, Applied AI and many more."

**Pay:** Not stated in the posting (India role).

---

### A5. Microsoft: Principal Data Engineer (Official, live)

| Field | Value |
|---|---|
| Title | Principal Data Engineer (Job ID 200058461) |
| Team | **Not named in the posting.** Department field: "Software Engineering". Hashtags: "#dataplatforms, #dataengineering, #AINative, #distributedsystems". Fabric/Azure is not mentioned by name. |
| Location | United States, Washington, Redmond (work option: onsite; travel "Less than 25%") |
| Date posted | 2026-09-30 (postedTs 1790793963 = 2026-09-30 18:46 UTC) |
| URL | https://apply.careers.microsoft.com/careers/job/1970393557014828 |
| Source read | `https://apply.careers.microsoft.com/api/pcsx/position_details?position_id=1970393557014828&domain=microsoft.com&hl=en` |

No US Microsoft posting with "Data Engineer" in the title and a Fabric/Azure team name was live. An exact-phrase search for `"data engineer"` on Microsoft's careers API returned 34 positions worldwide. All 34 were read, and this was the only US posting titled "Data Engineer".

**Overview (VERBATIM, excerpt):** "We are looking for a Principal Data Engineer to lead the architecture, development, and operation of scalable, reliable data platforms. This role requires deep expertise in ETL, data pipelines, data modeling, and distributed systems, with hands-on proficiency in Apache Spark, Python, and SQL."

**Responsibilities (VERBATIM)**
- Lead data-platform architecture: Design and evolve ETL workflows, data pipelines, and data models using Spark, Python, and SQL.
- Drive hands-on, end-to-end implementation: Build data solutions using Spark (or similar distributed systems), open table formats such as Delta Lake, and Parquet files; develop scalable, secure APIs and data access controls, including RBAC; provision resources through Infrastructure as Code; and deliver production-grade deployments through CI/CD with observability and operational runbooks.
- Think beyond immediate requirements: Own complex system-design decisions, evaluate alternatives, and account for cross-team dependencies, scalability, resiliency, disaster recovery, and cost.
- Make evidence-based decisions: Proactively gather facts, validate assumptions, test hypotheses, and use telemetry and investigation to resolve complex problems rather than relying on unverified assumptions.
- Advance AI-native engineering: Apply AI across design, coding, testing, and troubleshooting; validate AI-generated outputs and help the team adopt effective, responsible practices.
- Own production outcomes: Establish monitoring and operational readiness, drive incident resolution and root-cause analysis, and implement preventive improvements. Automate safe deployments, targeting zero-touch deployment where possible.
- Raise engineering quality: Lead design and code reviews, strengthen testing, and embed security, privacy, and compliance into solutions throughout their lifecycle.
- Collaborate and mentor: Communicate trade-offs clearly, align partner teams on dependencies and ownership, mentor engineers, and share knowledge to improve team capabilities.

**Required Qualifications (VERBATIM)**
- Bachelor's Degree in Computer Science or related technical field AND 8+ years technical engineering experience with coding in languages including, but not limited to, C, C++, C#, Java, JavaScript, or Python
- OR equivalent experience.

**Preferred Qualifications (VERBATIM)**
- Master's Degree in Computer Science or related technical field AND 12+ years technical engineering experience with coding in languages including, but not limited to, C, C++, C#, Java, JavaScript, or Python
- OR Bachelor's Degree in Computer Science or related technical field AND 15+ years technical engineering experience with coding in languages including, but not limited to, C, C++, C#, Java, JavaScript, or Python
- OR equivalent experience.
- Experience building data platforms for experimentation, metrics, and scorecards, including understanding success metrics, guardrail metrics, and data quality.
- Experience in Databricks like platforms.

**AI/LLM-related lines (VERBATIM)**
- "You will bring an AI-native approach to engineering—using and improving AI-assisted development practices to accelerate delivery while taking accountability for the quality, correctness, and responsible use of AI-generated work."
- "Advance AI-native engineering: Apply AI across design, coding, testing, and troubleshooting; validate AI-generated outputs and help the team adopt effective, responsible practices."

**Pay (VERBATIM):** "Software Engineering IC6 - The typical base pay range for this role across the U.S. is USD $165,600 - $296,400 per year. There is a different range applicable to specific work locations, within the San Francisco Bay area and New York City metropolitan area, and the base pay range for this role in those locations is USD $220,800 - $331,200 per year."

**Note:** A Microsoft job posting asks for "Experience in Databricks like platforms."

---

### A6. Snowflake: Senior Data Engineer - Product (Mirror, 2026; not on the official board today)

On 2026-10-14 Snowflake's official Ashby board listed **358** jobs and **none** was a "Data Engineer" role. Three titles contained "Data Engineering", and all were a manager, a sales specialist or a solutions architect. The first page of the careers-site (Phenom) search for "data engineer" (careers.snowflake.com) had no "Data Engineer" role either. The posting below comes from a mirror.

| Field | Value |
|---|---|
| Title | Senior Data Engineer - Product |
| Team | "Product and Data Science team". The mirror shows "Product, Data Science". |
| Location | Menlo Park, CA, USA |
| Date posted | 2026-05-27 (mirror JSON-LD `datePosted` 2026-05-27T16:18:16Z; `validThrough` 2026-08-13). The mirror page displays "Posted on May 27, 2026". |
| Mirror URL | https://careers.wing.vc/companies/snowflake/jobs/80594412-senior-data-engineer-product (Wing VC portfolio job board) |
| Status | Not present on https://api.ashbyhq.com/posting-api/job-board/snowflake on 2026-10-14. The posting is likely closed. |

**Role framing (VERBATIM):** "We are looking for a skilled Snowflake Data Engineer to join our Product and Data Science team. ... Additionally, you will play a critical role in cost optimization for data operations, owning efficient data modeling and pipeline performance."

**Responsibilities (VERBATIM)**
- Design, develop, and maintain scalable data pipelines using Snowflake and cloud technologies.
- Own and manage cost optimization for Product and Data Science team operations.
- Optimize pipelines for performance, reliability, and efficiency.
- Build and maintain dashboards and reporting platforms using Streamlit.
- Collaborate with cross-functional teams to gather requirements and deliver robust data solutions.
- Work with modern AI tools, including Cursor, to accelerate development.
- Implement data governance, security best practices, and access control policies.
- Develop and enforce data quality checks, SLA monitoring, and dependency tracking.
- Utilize version control systems (e.g., Git) and manage deployment workflows.
- Proactively troubleshoot and resolve data-related issues.

**Qualifications (VERBATIM)**
- Bachelor’s degree in Computer Science, Engineering, or a related field.
- Proven hands-on experience with Snowflake, including data modeling, ETL/ELT development, and performance tuning.
- Advanced proficiency in Python, with experience scripting and automating data workflows.
- Proven experience working with Spark for large-scale data processing.
- Demonstrated experience building Streamlit applications integrated with Snowflake.
- Strong command of SQL for complex data querying and analysis.
- Familiarity with cloud platforms such as AWS, Azure, or GCP, and services like S3, Redshift, or BigQuery.
- Strong problem-solving and communication skills.
- Ability to thrive both independently and as part of a collaborative, fast-paced team environment.

**Preferred Qualifications (VERBATIM)**
- Master’s degree in Computer Science, Engineering, or a related discipline.
- Strong understanding of data warehousing principles, architecture, and best practices.
- Experience working within Agile development frameworks (e.g., Scrum, Kanban).

**AI/LLM-related lines (VERBATIM)**
- "Work with modern AI tools, including Cursor, to accelerate development."
- Company preamble: "we seek AI-native thinkers across every function who are energized by the opportunity to reinvent how they work. You don’t just use tools; you possess an innate curiosity, treating AI as a high-trust collaborator that is core to how you solve problems and accelerate your impact."

**Pay:** The description gives no pay sentence. It says (VERBATIM): "For jobs located in the United States, please visit the job posting on the Snowflake Careers Site for salary and benefits information". The mirror displays "USD 168k-241,500 / year", and its JSON-LD `baseSalary` is 168000–241500 USD/year. Label this as **mirror-displayed**.

**Note:** Snowflake requires experience with Spark, which the posting names as the Databricks-origin engine: "Proven experience working with Spark for large-scale data processing."

---

### A7. Nvidia: two postings

On 2026-10-14 I ran six Nvidia Workday searches: "data engineer", "senior data engineer", "data engineer AI", "data platform engineer", "DGX Cloud data" and "Senior Data and Platform Engineer". In the top 10–20 results of each, no live US posting had a plain "Data Engineer" title. I did not page through all 1,590 hits for "data engineer", so this is not a full census. Two postings are recorded.

#### A7a. Official, live: Senior Synthetic Data Engineer - Autonomous Driving

| Field | Value |
|---|---|
| Title | Senior Synthetic Data Engineer - Autonomous Driving (JR2023850) |
| Team | NVIDIA DRIVE team |
| Location(s) | US, CA, Santa Clara; also US, TX, Remote; US, NY, Remote; US, WA, Remote; US, CA, Remote |
| Date posted | 2026-10-09 (Workday `startDate`; listed as "Posted 4 Days Ago"). The body says: "Applications for this job will be accepted at least until October 13, 2026." |
| URL | https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/job/US-CA-Santa-Clara/Senior-Synthetic-Data-Engineer---Autonomous-Driving_JR2023850-1 |
| Source read | Workday CXS API (`.../wday/cxs/nvidia/NVIDIAExternalCareerSite/job/...`) |

**Caveat:** This is a simulation and synthetic-data role, not a classic warehouse or pipeline DE role.

**What you'll be doing (VERBATIM)**
- Build, implement, and optimize tools to generate synthetic data for training different deep learning DRIVE networks, including simulated lidar, radar, camera/RGB-D, bounding boxes, object tracks, world models, segmentation, depth, scene semantics, and sensor metadata.
- Develop lidar and radar sensor simulation workflows that run against NuRec reconstructed driving worlds and Cosmos-generated environments, including sensor placement, calibration, material response, geometry handling, noise modeling, and scenario variation.
- Develop Cosmos world model for better world generation, encompassing controllable scenario generation, novel view synthesis, trajectory extrapolation, scene completion, quality triage, regression detection, and controllability evaluation.
- Collect perception, planning, and deep learning DRIVE network requirements and match them to current synthetic data and sensor simulation features. Develop new tools and improve performance when gaps are found.
- Develop dataset quality assessments and synthetic-real comparison procedures that evaluate sensor realism, annotation quality, distribution coverage, scenario diversity, and sim-to-real transfer for autonomous driving.
- Set up, profile, and supervise large-scale NuRec, Cosmos, and sensor simulation pipelines in data center or cloud environments.
- Debug cross-stack systems spanning sensors, reconstruction models, world models, simulation runtime, GPU workloads, distributed data services, and downstream autonomous-driving workloads.

**What we need to see (VERBATIM)**
- B.S. or M.S. in Computer Science, Electrical Engineering, Computer Engineering, Applied Math, Physics, or a related field (or equivalent experience).
- 8+ years of experience in computer graphics, computer vision, autonomous driving, sensor simulation, neural rendering, or physically-based sensor modeling, synthetic data generation, or closely related software engineering roles.
- Strong Python and C++ skills, with experience building, debugging, profiling, and maintaining production-quality systems on Linux.
- Solid mathematical foundation in linear algebra, geometry, probability.
- Familiarity with synthetic data annotations, data formats, dataset curation, data augmentation, and evaluation workflows for perception model training and validation.
- Familiarity with deep learning workflows and modern ML tooling, with enough practical understanding to translate network needs into synthetic data requirements and measurable quality criteria.
- Experience with scalable engineering workflows including Git, Docker, Kubernetes, CI/CD, distributed storage, and deployment in data centers or cloud environments.

**Ways to stand out from the crowd (VERBATIM)**
- Practical experience working directly with NVIDIA NuRec, Cosmos, world foundation models, Real2Sim systems, or autonomous-driving simulation and validation pipelines.
- Experience in NuRec world reconstruction, neural rendering, 3D Gaussian Splatting, NeRFs, or occupancy networks.
- Deep lidar or radar simulation expertise, such as ray tracing or ray casting, reflectance and intensity modeling, Doppler, radar cross-section, weather effects, occlusion, and sensor-specific noise models.
- Experience developing synthetic data pipelines for autonomous driving, closed-loop simulation, domain randomization, long-tail scenario mining, or sim-to-real transfer.
- Familiarity with autonomous vehicle data pipelines, OpenDRIVE, HD maps, scenario formats, vehicle dynamics, or AV safety validation.

**AI/LLM-related lines (VERBATIM)**
- "Familiarity with deep learning workflows and modern ML tooling, with enough practical understanding to translate network needs into synthetic data requirements and measurable quality criteria."
- "NVIDIA uses AI tools in its recruiting processes."

**Pay (VERBATIM):** "The base salary range is 184,000 USD - 287,500 USD for Level 4, and 224,000 USD - 356,500 USD for Level 5. You will also be eligible for equity and benefits."

#### A7b. Mirror (2026-10-08; official link no longer resolves): Senior Data and Platform Engineer, DGX Cloud. This is the closest to a classic DE role.

| Field | Value |
|---|---|
| Title | Senior Data and Platform Engineer (JR2026954) |
| Team | DGX Cloud organization, DGX Cloud Data Platform |
| Location(s) | Mirror JSON-LD: United States; California; Texas; Washington; New York. Official slug: "US-CA-Remote". |
| Date posted | 2026-10-08 (mirror `datePosted`). The body says: "Applications for this job will be accepted at least until October 9, 2026." |
| Mirror URL | https://jobs.anitab.org/companies/nvidia/jobs/96372239-senior-data-and-platform-engineer |
| Official URL | https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/job/US-CA-Remote/Senior-Data-and-Platform-Engineer_JR2026954. The Workday API returned **403 "permission denied"** on 2026-10-14 and the title was absent from search, so the posting is likely closed. |

**What you'll be doing (VERBATIM)**
- Define and guide the technical vision for a key DGX Cloud Data Platform domain covering various services, pipelines, data products, and consumer teams. Take responsibility for its architecture, interfaces, and growth, while foreseeing needs related to scale, reliability, performance, security, compatibility, and cost.
- Lead the technical delivery of complex, cross-team initiatives. Transform unclear requirements into well-defined architectures and interfaces, coordinate implementation methods among contributors, personally write essential code, overcome technical obstacles, and guide integrations securely into production.
- Architect, implement, and evolve batch and streaming systems that ingest, transform, reconcile, and serve fleet, capacity, utilization, cost, scheduling, and operational telemetry at scale across multiple environments and consumers.
- Build shared platform capabilities—including libraries, workflow and orchestration abstractions, deployment tooling, and implementation standards—that are adopted across teams and measurably improve delivery speed, reliability, operational effort, and cost.
- Serve as the technical lead for high-impact production investigations spanning pipelines, applications, query engines, distributed processing, storage, networks, and cloud services. Coordinate across owners, establish root cause, drive durable resolution, and ensure preventive improvements are implemented.
- Establish and drive adoption of engineering standards for automated testing, data quality, reconciliation, lineage, service-level objectives, observability, secure service identities, least-privilege access, release readiness, and auditable deployments.
- Establish robust data models, semantics, ownership boundaries, and serving interfaces across teams. Provide tables, APIs, automation, dashboards, and internal applications that ensure trusted DGX Cloud data is widely accessible without sacrificing accuracy or maintainability.
- Provide technical leadership through architecture and build reviews, hands-on mentorship of senior engineers, and evidence-based resolution of difficult tradeoffs. Raise engineering quality across teams through reusable patterns, clear decisions, and sustained follow-through.

**What we need to see (VERBATIM)**
- 8+ years of relevant industry experience with a Bachelor’s or equivalent experience, and a Master’s degree or equivalent experience in Computer Science, Engineering, or a related field.
- A sustained record of personally crafting, implementing, and operating production software, data platforms, databases, or distributed systems. This includes end-to-end technical ownership of a multi-system platform domain or a complex cross-team engineering initiative.
- Experience includes deep hands-on work with distributed processing, analytical or relational databases, production ETL, change-data capture, streaming or event processing, or backend and cloud systems handling large data volumes.
- Strong software engineering fundamentals and production proficiency in a backend or systems language, with deep experience using data-processing and platform libraries or frameworks to build reliable systems. Experience crafting reusable abstractions, reviewing substantial changes, and debugging critical code paths. Equivalent depth across different technology stacks is welcome.
- Strong SQL and data-modeling skills, including practical depth in query execution, incremental processing, schema evolution, consistency, analytical consumption, idempotency, replay, late-arriving data, partial failure, and cross-system correctness.
- Demonstrated skill in diagnosing failures across various systems by analyzing logs, metrics, traces, query plans, profiles, and controlled experiments, followed by applying and confirming long-lasting solutions.
- Strong architectural judgment in assessing tradeoffs among reliability, performance, cost, security, compatibility, and maintainability, including experience guiding major migrations or architectural changes across teams without interrupting production service.
- Experience establishing production safeguards and engineering practices that multiple teams adopt, including automated testing, CI/CD, monitoring, alerting, rollback, incident response, and secure deployment.

**Ways to stand out from the crowd (VERBATIM)**
- Deep experience with distributed data processing and lakehouse architectures, including optimization, reliability, and operation at production scale. Equivalent experience with large-scale database or data-processing platforms is welcome.
- Experience crafting and operating distributed streaming or event-driven systems, including partitioning, consumer behavior, flow control, replay, delivery guarantees, and schema evolution.
- Experience leading the scaling, migration, or performance improvement of relational, distributed, time-series, object-storage, or data systems specialized in managing searchable content.
- Background operating cloud infrastructure, container orchestration, workload schedulers, compute or GPU clusters, and fleet-scale telemetry.
- Experience defining and owning the production adoption of agentic systems or workflow automation. You should focus on evaluation, permissions, observability, failure recovery, and measurable improvements in engineering efficiency or operational outcomes.

**AI/LLM-related line (VERBATIM):** "Experience defining and owning the production adoption of agentic systems or workflow automation. You should focus on evaluation, permissions, observability, failure recovery, and measurable improvements in engineering efficiency or operational outcomes."

**Pay (VERBATIM, mirror):** "The base salary range is 168,000 USD - 270,250 USD. You will also be eligible for equity and benefits."

---

### A8. Apple: Data Engineer (Data Products - Apple Ads) (Official, live)

| Field | Value |
|---|---|
| Title | Data Engineer (Data Products - Apple Ads) (Role 200687054) |
| Team | Apple Ads, Data Org. Team field: "Software and Services". The page data field `highJobTitle` reads "Software Development Engineering ICT2". |
| Location | Cupertino, California, United States |
| Date posted | Oct 12, 2026 (`postDateInGMT` 2026-10-12T19:32:08Z) |
| URL | https://jobs.apple.com/en-us/details/200687054/data-engineer-data-products-apple-ads |
| Source read | The page above (server-rendered hydration JSON) |

**Experience framing (VERBATIM, summary):** "You should have 1-4 years of experience in software engineering roles, ideally within the ads or media space. ... We will calibrate the level and scope to your experience."

**Description / responsibilities (VERBATIM, "As a member of the Data Org, you will:")**
- Engineer secure, scalable data and machine learning systems across real-time, near-real-time, and batch execution contexts using Spark, Kafka, Iceberg, and beyond
- Own the design and delivery of core components — from pipeline architecture to ML model development, training, and deployment — including support for privacy-preserving, mission-critical infrastructure
- Drive reliability, performance, and efficiency improvements across your systems, including schema changes, backfills, and the experimentation and testing infrastructure (e.g. A/B testing) needed to validate them
- Apply a strong understanding of the intersection between business, analytics, and engineering, with a proactive focus on reusable, efficient solutions
- Use LLMs and AI coding agents (e.g. Claude, Gemini) daily to accelerate implementation, testing, and debugging — continually validating every result for correctness, privacy, and cost
- Collaborate with a team of world-class engineers and product managers; grow through code and design reviews, and mentor others as you gain seniority
- Contribute to on-call, monitoring, and continuous reliability and efficiency improvements; more senior engineers help lead incident response and root-cause analysis
- Work effectively in a rapidly changing, sprint-based Agile environment, and contribute to a culture that emphasizes reliability, resiliency, extensibility, scalability, and productivity. We are one team, nurturing each other's growth and supporting each other in delivering for our customers and Apple

**Minimum Qualifications (VERBATIM)**
- 1+ years of industry experience building scalable data pipelines and machine learning systems, or other distributed software, at scale
- Strong computer science and software engineering fundamentals
- Proficiency in modern programming languages such as Rust, Python, Java, or Scala
- Experience with distributed systems and data processing technologies (e.g. Spark, Kafka, Flink)
- Experience building and scaling systems on premise and in the cloud
- Solid understanding of data structures, algorithms, and system design principles
- Ability to communicate effectively with cross-functional technical and non-technical teams
- Hands-on experience using LLMs (e.g. Claude, Gemini) in daily engineering work — for code generation, review, debugging, test writing, agentic loops, and evaluation systems— to continually improve software engineering skills and velocity
- Excellent collaborative skills
- BS/MS in Computer Science, Software Engineering, Distributed Systems, or a related field

**Preferred Qualifications (VERBATIM)**
- Experience with NoSQL datastores (e.g. Cassandra, Keyspaces, ElastiCache)
- Experience with lakehouse and Iceberg table formats
- Experience with anomaly detection
- Experience with A/B experimentation frameworks
- History of driving reliability, efficiency, or cost improvements, and mentoring other engineers
- Comfortable working in a rapidly changing environment with ambiguous requirements
- Prior experience in the advertising industry is a huge plus

**AI/LLM-related lines (VERBATIM)**
- "Use LLMs and AI coding agents (e.g. Claude, Gemini) daily to accelerate implementation, testing, and debugging — continually validating every result for correctness, privacy, and cost"
- Minimum qualification: "Hands-on experience using LLMs (e.g. Claude, Gemini) in daily engineering work — for code generation, review, debugging, test writing, agentic loops, and evaluation systems— to continually improve software engineering skills and velocity"

**Pay (VERBATIM):** "The base pay range for this role is between $129,300 and $194,700, and your base pay will depend on your skills, qualifications, experience, and location."

**Context:** A US search on jobs.apple.com for "data engineer" (first 4 result pages, 2026-10-14) returned 19 unique postings whose titles contain "Data Engineer" or "Data Engineering". Examples: "AIML Data Engineer", "Data Engineer (Agentic AI, LLM Training), G&A Solutions Engineering (GSE)", "Simulation Generative Data Engineer".

---

## Part B: Compensation numbers (Levels.fyi)

**How to read these:**
- All figures are total compensation per year in USD, United States, as displayed on the Levels.fyi page on 2026-10-14. Every page showed "Last updated: 10/14/2026".
- The "median yearly compensation package" is computed by Levels.fyi from a smaller recent US sample than the "tracks N submissions" count. Each page's structured data (`sampleSize`) gives that smaller number, and it is listed below as "median sample".
- The per-level table on company pages is headed **"Average"**, so per-level figures are averages, not medians.
- Many pages are **locked**, showing "We only need 4 more ... submissions ... to unlock". No figures are shown on those pages, so none are quoted. Hidden values in the page source were deliberately not used.

### B1. Databricks: data engineer / senior data engineer

- **Levels.fyi Databricks Data Engineer page: LOCKED, NOT VERIFIED.**
  - URL: https://www.levels.fyi/companies/databricks/salaries/software-engineer/title/data-engineer
  - The page shows: "We only need 4 more Software Engineer submissions at Databricks to unlock". It shows no figures.
- **Context only (Levels.fyi, Databricks Software Engineer, all titles; this is NOT data-engineer data):**
  - URL: https://www.levels.fyi/companies/databricks/salaries/software-engineer
  - VERBATIM: "Software Engineer compensation in United States at Databricks ranges from $274K per year for L3 to $1.71M per year for L7. The median yearly compensation package in United States totals $306K. Levels.fyi tracks 636 Software Engineer salary submissions at Databricks."
  - Level averages: L3 $274K; L4 $423K; L5 (Senior Software Engineer) $588K; L6 (Staff) $1.3M; L7 (Senior Staff) $1.7M.
- **Third-party, NOT Levels.fyi (DataDriven):**
  - URL: https://datadriven.io/companies/databricks/salary
  - The page says "Last updated: September 23, 2026" and was read 2026-10-14.
  - It shows Databricks data engineer total comp medians: L3 $220K (6 reports); L4 $248K (8); **L5 Senior $364K (13 reports; range $324K–$410K)**; L6 Staff $440K (3). That is 30 reports in total.
  - The site does not say where its "verified salary reports" come from. Treat it as a secondary source.

### B2. Google: data engineer vs ML engineer vs AI engineer (Levels.fyi)

| Title at Google | Median TC (US) | Submissions tracked / median sample | Per-level averages (as shown) | URL |
|---|---|---|---|---|
| Data Engineer | **$280K** | 63 / 18 | L3 $174K; L4 $276K; L5 $291K; L6 $358K | https://www.levels.fyi/companies/google/salaries/software-engineer/title/data-engineer |
| Machine Learning Engineer | **$354K** | 84 / 19 | L3 $205K; L4 $312K; L5 $445K; L6 $646K; L7 $743K | https://www.levels.fyi/companies/google/salaries/software-engineer/title/machine-learning-engineer |
| AI Engineer | **$260K** | 37 / 13 | L3 $192K; L5 $355K; L6 $583K | https://www.levels.fyi/companies/google/salaries/software-engineer/title/ai-engineer |

VERBATIM DE line: "Data Engineer compensation in United States at Google ranges from $174K per year for L3 to $358K per year for L6. The median yearly compensation package in United States totals $280K."

VERBATIM MLE line: "Machine Learning Engineer compensation in United States at Google ranges from $205K per year for L3 to $743K per year for L7. The median yearly compensation package in United States totals $354K."

**Derived from the figures above:** At Google, the ML Engineer median is $74K/yr above the Data Engineer median. At L5 (Senior) the averages are $445K vs $291K. The AI Engineer median ($260K) is below the Data Engineer median ($280K).

### B3. JPMorgan Chase data engineer + fintech comparison (Levels.fyi)

| Company | Median TC (US) | Tracked / median sample | Per-level averages | URL |
|---|---|---|---|---|
| JPMorgan Chase | **$145K** | 69 / 16 | Analyst (502) $138K; Associate (601) $146K; Senior Associate (602) $157K; Vice President (603) $168K; Executive Director (604) $330K | https://www.levels.fyi/companies/jpmorgan-chase/salaries/software-engineer/title/data-engineer |
| Stripe | **$400K** (**small sample: 4**) | n/a / 4 | L3 $415K | https://www.levels.fyi/companies/stripe/salaries/software-engineer/title/data-engineer |
| Block | **$272K** | 32 / 10 | Level 4 $152K; Level 5 $240K; Level 6 $295K | https://www.levels.fyi/companies/block/salaries/software-engineer/title/data-engineer |
| Capital One (bank, extra) | **$180K** | 82 / 22 | Associate SWE $132K … Senior Lead SWE $321K | https://www.levels.fyi/companies/capital-one/salaries/software-engineer/title/data-engineer |
| Goldman Sachs (bank, extra) | **$230K** | 41 / 23 | Analyst $107K; Associate $154K; VP $235K | https://www.levels.fyi/companies/goldman-sachs/salaries/software-engineer/title/data-engineer |
| PayPal (extra) | **$233K** | 22 / 9 | CL5 $183K; CL6 $225K | https://www.levels.fyi/companies/paypal/salaries/software-engineer/title/data-engineer |

- VERBATIM JPMC line: "Data Engineer compensation in United States at JPMorgan Chase ranges from $138K per year for 502 to $330K per year for 604. The median yearly compensation package in United States totals $145K. Levels.fyi tracks 69 Data Engineer salary submissions at JPMorgan Chase."
- VERBATIM Stripe line: "Data Engineer compensation in United States at Stripe totals $415K per year for L3. The median yearly compensation package in United States totals $400K." Only 4 US data points are behind this, so do not present it as robust.
- **Plaid: LOCKED, NOT VERIFIED** (https://www.levels.fyi/companies/plaid/salaries/software-engineer/title/data-engineer). Robinhood, Chime and Affirm DE pages were also locked.

### B4. Amazon data engineer: L5 vs L6 (Levels.fyi)

- URL: https://www.levels.fyi/companies/amazon/salaries/software-engineer/title/data-engineer
- VERBATIM: "Data Engineer compensation in United States at Amazon ranges from $183K per year for L4 to $539K per year for L7. The median yearly compensation package in United States totals $230K. Levels.fyi tracks 756 Data Engineer salary submissions at Amazon."
- Per-level averages, using Levels.fyi's level labels:
  - L4 ("SDE I") $183K (base $137K / stock $26K / bonus $21K)
  - **L5 ("SDE II") $231K** (base $161K / stock $69K / bonus $1.8K)
  - **L6 ("SDE III" / Senior SDE) $334K** (base $191K / stock $143K / bonus $0)
  - L7 ("Principal SDE") $539K
- **Derived:** L6 − L5 = $103K/yr, or about +45%. Most of the gap is stock ($143K vs $69K).

### B5. Trading firm data engineer vs big-tech data engineer (Levels.fyi)

- **Citadel, Jane Street, Two Sigma: LOCKED, NOT VERIFIED.** Each page shows "We only need 4 more Software Engineer submissions at [firm] to unlock":
  - https://www.levels.fyi/companies/citadel/salaries/software-engineer/title/data-engineer
  - https://www.levels.fyi/companies/jane-street/salaries/software-engineer/title/data-engineer
  - https://www.levels.fyi/companies/two-sigma/salaries/software-engineer/title/data-engineer
- Also locked: Hudson River Trading, Jump Trading, DRW, Optiver, IMC, D.E. Shaw, Tower Research Capital, Akuna Capital, Millennium, Bridgewater Associates.
- **Firms with visible DE data:**

| Firm | Median TC (US) | Sample | URL |
|---|---|---|---|
| Susquehanna International Group (SIG), trading firm | **$138K** | median sample 5 (**small**); "Associate Software Engineer" average $131K | https://www.levels.fyi/companies/susquehanna-international-group/salaries/software-engineer/title/data-engineer |
| Point72 (hedge fund) | **$155K** | 9 submissions | https://www.levels.fyi/companies/point72/salaries/software-engineer/title/data-engineer |
| **Meta (big tech)** | **$304K** | 562 tracked / 36 median sample; E3 $170K, E4 $248K, E5 $355K, E6 $527K, E7 $835K | https://www.levels.fyi/companies/meta/salaries/software-engineer/title/data-engineer |
| Google (big tech) | $280K | see B2 | see B2 |

- VERBATIM SIG: "Data Engineer compensation in United States at Susquehanna International Group totals $131K per year for Associate Software Engineer. The median yearly compensation package in United States totals $138K."
- VERBATIM Point72: "The median Data Engineer compensation package at Point72 in United States totals $155K per year. Levels.fyi tracks 9 Data Engineer salary submissions at Point72."
- VERBATIM Meta: "Data Engineer compensation in United States at Meta ranges from $170K per year for E3 to $835K per year for E7. The median yearly compensation package in United States totals $304K. Levels.fyi tracks 562 Data Engineer salary submissions at Meta."
- **Caveat:** The trading-firm DE samples are tiny (5 and 9). Do not claim that "trading firms pay DEs less" in general. The defensible claim is: "on Levels.fyi, the reported DE medians at SIG ($138K) and Point72 ($155K) are below Meta ($304K)", with the sample sizes noted.

### B6. "AI Engineer" vs "Data Engineer" (and ML Engineer), US median TC (Levels.fyi job-family pages)

| Title (US, all companies) | Median TC | Sample | URL |
|---|---|---|---|
| Data Engineer | **$159,000** | 1,189 | https://www.levels.fyi/t/software-engineer/title/data-engineer |
| AI Engineer | **$151,000** | 334 | https://www.levels.fyi/t/software-engineer/title/ai-engineer |
| Machine Learning Engineer | **$280,000** | 1,065 | https://www.levels.fyi/t/software-engineer/title/machine-learning-engineer |

- VERBATIM page text:
  - "The median Data Engineer salary is $159,000."
  - "The median yearly total compensation of a AI Engineer in United States is $151,000."
  - "The median yearly total compensation of a Machine Learning Engineer in United States is $280,000."
- Data Engineer percentiles: p25 $117,415 / p75 $225,000 / p90 $315,000.
- AI Engineer percentiles: p25 $110,000 / p75 $211,250 / p90 $280,000.
- Machine Learning Engineer percentiles: p25 $200,000 / p75 $385,000 / p90 $495,000.
- The sample sizes are the `sampleSize` values in each page's Occupation structured data.

---

## Verification status summary

| Item | Status | Source type |
|---|---|---|
| A1 OpenAI | Verified (live). Two conflicting pay ranges are flagged. | Official (Ashby API + page) |
| A2 Uber | Verified (live SWE II Data Infrastructure). No live DE or new-grad DE role exists. The 2026 DE posting is from a mirror and its official link is 404. | Official + Mirror |
| A3 Anthropic | Verified (live) | Official (Greenhouse API) |
| A4 Databricks | Verified (live), but no "Data Engineer" title exists. A Data Platform SWE role in Bengaluru was used instead. No pay range. | Official (Greenhouse API) |
| A5 Microsoft | Verified (live). Fabric/Azure team is **not named** in the posting. | Official (Eightfold API) |
| A6 Snowflake | Verified from a mirror only. The posting is not on the official board today. | Mirror (Wing VC, JSON-LD) |
| A7 Nvidia | Verified: official live Synthetic DE role + mirror DGX Cloud data platform role (official link 403). | Official + Mirror |
| A8 Apple | Verified (live) | Official (jobs.apple.com) |
| B1 Databricks DE comp | **Levels.fyi locked.** Third-party DataDriven figures recorded. Levels.fyi SWE figures are context only. | Levels.fyi + third-party |
| B2 Google DE vs MLE vs AI Eng | Verified | Levels.fyi |
| B3 JPMC + fintech | Verified (Stripe sample is only 4). Plaid locked. | Levels.fyi |
| B4 Amazon L5 vs L6 | Verified | Levels.fyi |
| B5 Trading vs big tech | Citadel, Jane Street and Two Sigma **locked**. SIG and Point72 verified (small samples). Meta and Google verified. | Levels.fyi |
| B6 AI Eng vs DE (US) | Verified | Levels.fyi |

**Things that could NOT be verified:**
- Any Levels.fyi data-engineer figure for Databricks, Plaid, Citadel, Jane Street, Two Sigma, HRT, Jump, Optiver, IMC, DRW, D.E. Shaw, Tower, Akuna, Millennium, Bridgewater, Robinhood, Chime or Affirm. These pages are locked.
- A live entry-level or new-grad "Data Engineer" posting at Uber. None exists among 643 live reqs.
- A live US "Data Engineer" posting at Databricks, Snowflake or Nvidia under that exact title.
- Which Microsoft org owns the Principal Data Engineer role. The posting does not say.
- A search summary claimed an official Uber listing was titled "Data Engineer I". I could not confirm this because the official page returns 404, so it is not used.
