
### Jennifer O'Halloran
## 18/06/25 

## Thesis Project - TeaPP Visualisation and Analysis App

## Postgres Relation Database Schema - RawData Trail



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

### Raw Data Table -- storage of inital data in unedited format 


cur.execute("""
    CREATE TABLE IF NOT EXISTS rawData (
        clone_id TEXT PRIMARY KEY,
        female_par TEXT,
        male_par TEXT
    );
""")

conn.commit()

cur.close()
conn.close()
