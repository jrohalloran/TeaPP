import psycopg2
#print(psycopg2.__version__)



conn = psycopg2.connect(
    dbname="accounts_teapp",
    user="postgres",
    password= "liptontea",
    host="localhost",
    port="5432"
)




cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS users CASCADE;")


cur.execute("""
    CREATE TABLE IF NOT EXISTS users(
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        email TEXT NOT NULL
    );
""")

conn.commit()

cur.close()
conn.close()
