
### Jennifer O'Halloran
## 23/06/25 

## Thesis Project - TeaPP Visualisation and Analysis App

## Postgres Relation Database Schema - cleanedData Trail



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


cur.execute("DROP TABLE IF EXISTS cleanData CASCADE;")
cur.execute("DROP TABLE IF EXISTS preProcessedData CASCADE;")
cur.execute("DROP TABLE IF EXISTS rawData CASCADE;")


### Raw Data Table -- storage of inital data in unedited format 


cur.execute("""
    CREATE TABLE IF NOT EXISTS rawData (
        clone_id TEXT PRIMARY KEY,
        female_par TEXT,
        male_par TEXT
    );
""")

cur.execute("""
    CREATE TABLE IF NOT EXISTS preProcessedData (
        clone_id TEXT REFERENCES rawData(clone_id) ON DELETE CASCADE,
        correct_id TEXT PRIMARY KEY,
        correct_female TEXT,
        correct_male TEXT 
    );
""")

cur.execute("""
    CREATE TABLE IF NOT EXISTS cleanData (
        clone_id TEXT REFERENCES rawData(clone_id) ON DELETE CASCADE,
        correct_id TEXT PRIMARY KEY,
        correct_female TEXT,
        correct_male TEXT,
        removed BOOLEAN DEFAULT FALSE,
        year INTEGER,
        generation INTEGER
    );
""")

conn.commit()

cur.close()
conn.close()
