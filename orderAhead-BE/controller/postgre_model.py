import psycopg2
import csv

params = {
  'host': "52.191.3.0",
  'database': "postgres",
  'user': "postgres",
  'password': "N^cfZkujmn3dIjMjVHd"
}


class Postgres_DB:

  @classmethod
  def connect(self):
    conn = psycopg2.connect(host=params['host'], database=params['database'], user=params['user'], password=params['password'])
    return conn

  @classmethod
  def get_table_list(self):
      conn = self.connect()
      cur = conn.cursor()
      cur.execute(
          "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'")
      result = cur.fetchall()
      cur.close()
      conn.close()

      return result

  @classmethod
  def fetchone(self, sql, mapping = None):
    conn = self.connect()
    cur = conn.cursor()
    cur.execute(sql)
    result = cur.fetchone()
    cur.close()
    conn.close()

    return self.build_object(result, mapping)

  @classmethod
  def iter_row(self, cursor, size=10):
    while True:
        rows = cursor.fetchmany(size)
        if not rows:
            break
        for row in rows:
            yield row

  @classmethod
  def fetchall(self, sql, mapping = None):
    conn = self.connect()
    cur = conn.cursor()
    cur.execute(sql)

    result = []
    for row in self.iter_row(cur):
      obj = self.build_object(row, mapping)
      result.append(row)

    cur.close()
    conn.close()

    return result

  @classmethod
  def fetch_column_name(self, sql):
      conn = self.connect()
      cur = conn.cursor()
      cur.execute(sql)
      colnames = [desc[0] for desc in cur.description]
      cur.close()
      conn.close()

      return colnames

  @classmethod
  def copy_csv(self, sql):

      conn = self.connect()
      cur = conn.cursor()
      cur.execute(sql)
      conn.commit()
      cur.close()
      conn.close()

  @classmethod
  def build_object(self, row, mapping):
    if mapping == None:
      return row

    return mapping(row)

    # keys = mapping.keys()
    # values = mapping.values()
