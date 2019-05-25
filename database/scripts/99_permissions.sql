-- Permissions must be granted AFTER all tables, schemas etc have been created
GRANT USAGE ON SCHEMA geki_data TO api;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA geki_data TO api;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA geki_data TO api;

GRANT USAGE ON SCHEMA geki_view TO api;
GRANT SELECT ON ALL TABLES IN SCHEMA geki_view TO api;