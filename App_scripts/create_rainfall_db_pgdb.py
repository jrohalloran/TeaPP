
### Jennifer O'Halloran
## 03/07/25 

## Thesis Project - TeaPP Visualisation and Analysis App

## Postgres Relation Database Schema - Rainfall Table Trail


import psycopg2


conn = psycopg2.connect(
    dbname="teapp_app_db",
    user="postgres",
    password= "liptontea",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

### Raw Data Table -- storage of inital data in unedited format 
cur.execute("DROP TABLE IF EXISTS rainfall CASCADE;")

cur.execute("""
    CREATE TABLE IF NOT EXISTS rainfall (
        id SERIAL PRIMARY KEY,
        year INTEGER,
        month TEXT,
        rainfall NUMERIC,
        date TEXT
    );
""")

conn.commit()

cur.close()
conn.close()
