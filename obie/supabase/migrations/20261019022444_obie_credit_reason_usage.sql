-- Model usage charged against a finished task.
alter type public.credit_reason add value if not exists 'usage';
