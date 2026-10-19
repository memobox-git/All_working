-- The agent catalog: pack "Courses and Coaching" plus the core agents.
-- slug names a blueprint in code (sales, sales.booking, marketing.social.linkedin);
-- parent_id nests subagents under their main agent and platform agents under
-- Social Media. Nano agents are never seeded: they are created per task.

alter table public.blueprints
  add column slug text,
  add column parent_id uuid references public.blueprints (id) on delete cascade,
  add column sort_order integer not null default 0;

create unique index blueprints_catalog_slug_idx on public.blueprints (slug) where workspace_id is null;
create index blueprints_parent_id_idx on public.blueprints (parent_id);

create temporary table catalog (slug text, parent_slug text, stack text, role text, level text, description text, default_model text, sort_order int) on commit drop;

insert into catalog values
    ('obie', null, 'obie', 'OBIE', 'main', 'The front desk. Learns the business, builds the team and routes requests.', 'claude-sonnet-5-5', 0),

    ('sales', null, 'sales', 'Sales', 'main', 'Turns interest into paying customers.', 'claude-sonnet-5-5', 10),
    ('sales.inbound', 'sales', 'sales', 'Inbound', 'sub', 'Answers new leads and qualifies them.', 'claude-sonnet-5-5', 11),
    ('sales.booking', 'sales', 'sales', 'Booking', 'sub', 'Books discovery and sales calls.', 'claude-haiku-5-5', 12),
    ('sales.call_prep', 'sales', 'sales', 'Call Prep', 'sub', 'Researches each lead and writes a call brief.', 'claude-sonnet-5-5', 13),
    ('sales.follow_up', 'sales', 'sales', 'Follow-up', 'sub', 'Drafts follow-ups after calls and quiet leads.', 'claude-sonnet-5-5', 14),
    ('sales.close', 'sales', 'sales', 'Close', 'sub', 'Writes proposals and handles objections.', 'claude-sonnet-5-5', 15),
    ('sales.pipeline', 'sales', 'sales', 'Pipeline', 'sub', 'Keeps the pipeline tidy and flags stuck deals.', 'claude-haiku-5-5', 16),

    ('marketing', null, 'marketing', 'Marketing', 'main', 'Gets the right people to notice the business.', 'claude-sonnet-5-5', 20),
    ('marketing.strategy', 'marketing', 'marketing', 'Strategy', 'sub', 'Plans themes, campaigns and the content calendar.', 'claude-sonnet-5-5', 21),
    ('marketing.content', 'marketing', 'marketing', 'Content', 'sub', 'Writes posts, emails, scripts and articles.', 'claude-sonnet-5-5', 22),
    ('marketing.social', 'marketing', 'marketing', 'Social Media', 'sub', 'Adapts content for each platform and schedules it.', 'claude-sonnet-5-5', 23),
    ('marketing.social.youtube', 'marketing.social', 'marketing', 'YouTube', 'sub', 'Titles, descriptions, scripts and community posts for YouTube.', 'claude-sonnet-5-5', 24),
    ('marketing.social.linkedin', 'marketing.social', 'marketing', 'LinkedIn', 'sub', 'LinkedIn posts, carousels and comment replies.', 'claude-sonnet-5-5', 25),
    ('marketing.social.instagram', 'marketing.social', 'marketing', 'Instagram', 'sub', 'Captions, reels ideas and stories for Instagram.', 'claude-sonnet-5-5', 26),
    ('marketing.social.tiktok', 'marketing.social', 'marketing', 'TikTok', 'sub', 'Short video hooks and scripts for TikTok.', 'claude-sonnet-5-5', 27),
    ('marketing.social.facebook', 'marketing.social', 'marketing', 'Facebook', 'sub', 'Posts and group content for Facebook.', 'claude-sonnet-5-5', 28),
    ('marketing.social.x', 'marketing.social', 'marketing', 'X', 'sub', 'Posts and threads for X.', 'claude-sonnet-5-5', 29),
    ('marketing.ads', 'marketing', 'marketing', 'Ads', 'sub', 'Drafts ad copy and suggests targeting.', 'claude-sonnet-5-5', 30),
    ('marketing.nurture', 'marketing', 'marketing', 'Nurture', 'sub', 'Writes email sequences that warm up leads.', 'claude-sonnet-5-5', 31),
    ('marketing.community', 'marketing', 'marketing', 'Community', 'sub', 'Runs community posts, events and member replies.', 'claude-sonnet-5-5', 32),

    ('customers', null, 'customers', 'Customers', 'main', 'Keeps customers happy, successful and coming back.', 'claude-sonnet-5-5', 40),
    ('customers.onboarding', 'customers', 'customers', 'Onboarding', 'sub', 'Welcomes new customers and gets them started.', 'claude-sonnet-5-5', 41),
    ('customers.support', 'customers', 'customers', 'Support', 'sub', 'Drafts answers to customer questions.', 'claude-haiku-5-5', 42),
    ('customers.homework', 'customers', 'customers', 'Homework and Feedback', 'sub', 'Reviews student work and drafts feedback.', 'claude-sonnet-5-5', 43),
    ('customers.reviews', 'customers', 'customers', 'Reviews', 'sub', 'Asks happy customers for reviews and testimonials.', 'claude-haiku-5-5', 44),

    ('product', null, 'product', 'Product', 'main', 'Builds and improves what the business sells.', 'claude-sonnet-5-5', 50),
    ('product.course_builder', 'product', 'product', 'Course Builder', 'sub', 'Outlines modules, lessons and exercises.', 'claude-sonnet-5-5', 51),
    ('product.materials', 'product', 'product', 'Materials', 'sub', 'Makes worksheets, templates and slides.', 'claude-sonnet-5-5', 52),

    ('operations', null, 'operations', 'Operations', 'main', 'Keeps the business running smoothly behind the scenes.', 'claude-sonnet-5-5', 60),
    ('operations.payments', 'operations', 'operations', 'Payments', 'sub', 'Tracks invoices, payments and refunds.', 'claude-haiku-5-5', 61),
    ('operations.files', 'operations', 'operations', 'Files', 'sub', 'Keeps documents organised and easy to find.', 'claude-haiku-5-5', 62),
    ('operations.scheduling', 'operations', 'operations', 'Scheduling', 'sub', 'Manages the calendar and reminders.', 'claude-haiku-5-5', 63)
;

insert into public.blueprints (slug, pack, stack, role, level, description, default_model, sort_order, is_custom)
select slug, case when stack = 'obie' then 'core' else 'Courses and Coaching' end,
       stack, role, level::public.agent_level, description, default_model, sort_order, false
from catalog
on conflict (slug) where workspace_id is null do nothing;

update public.blueprints child
set parent_id = parent.id
from catalog c
join public.blueprints parent on parent.slug = c.parent_slug and parent.workspace_id is null
where child.slug = c.slug and child.workspace_id is null;
