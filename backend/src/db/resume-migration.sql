-- Add join_date and exit_date columns to resume_entries
ALTER TABLE resume_entries ADD COLUMN join_date TEXT;
ALTER TABLE resume_entries ADD COLUMN exit_date TEXT;
