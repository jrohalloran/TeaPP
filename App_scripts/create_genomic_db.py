
### Jennifer O'Halloran
## 15/07/25 

## Thesis Project - TeaPP Visualisation and Analysis App

## Postgres Relation Database Schema - Genomic Table



import psycopg2
#print(psycopg2.__version__)


conn = psycopg2.connect(
    dbname="teapp_app_db",
    user="postgres",
    password= "liptontea",
    host="localhost",
    port="5432"
)

cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS genomicData CASCADE;")


cur.execute("""
    CREATE TABLE IF NOT EXISTS genomicData (
        id SERIAL PRIMARY KEY,
        clone_id TEXT NOT NULL,
        file_location TEXT,
        file_name TEXT,
        additional_data TEXT
    );
""")


conn.commit()

cur.close()
conn.close()