-- Users must be granted permissions AFTER everything else has been created

CREATE ROLE api NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT LOGIN PASSWORD 'c76Jkeb&q8Dxw@8wktMKVVp$^m8fboY6KJz!SYPJ^GH5WdWMnBIG@rajhMFKMWy*';
GRANT CONNECT ON DATABASE geki TO api;

GRANT USAGE ON SCHEMA geki_data TO api;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA geki_data TO api;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA geki_data TO api;

GRANT USAGE ON SCHEMA geki_view TO api;
GRANT SELECT ON ALL TABLES IN SCHEMA geki_view TO api;