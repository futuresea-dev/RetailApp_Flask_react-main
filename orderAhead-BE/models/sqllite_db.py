import sqlite3
import common
import os
from contextlib import closing

db_name = os.getenv('DB_NAME', 'order.db')
db_path = os.path.join('db', db_name)

class SqlLite_DB:
  @classmethod
  def fetchone(cls, sql, to_filter = []):
    with closing(sqlite3.connect(db_path)) as conn:
      conn.row_factory = common.dict_factory
      cur = conn.cursor()
      return cur.execute(sql, to_filter).fetchone()

  @classmethod
  def query(cls, sql):
    with closing(sqlite3.connect(db_path)) as conn:
      conn.row_factory = common.dict_factory
      cur = conn.cursor()
      cur.execute(sql)
      conn.commit()
