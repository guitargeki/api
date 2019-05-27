#!/bin/sh
## Make sure the file has LF line endings!

cd /backup/backup
pg_dumpall -U $PGUSER -h $PGHOST --clean --roles-only > 10_roles.sql
pg_dump $POSTGRES_DB --format=p -n geki_data -n geki_view --verbose --username=$POSTGRES_USER > 50_db.sql
git add 10_roles.sql
git add 50_db.sql
git commit -m "Automated backup test"
git push