import json
from models.postgres_db import Postgres_DB
from models.base import Base

class ActiveRecord(Base):
  table_name = None
  primary_key = None
  allow_fields = {}

  def __init__(self, record_id):
    self.is_loaded = False
    self.id = record_id
    self.init_data()

  def init_data(self):
    self.data = {}
    # for key in self.allow_fields:
    #   self.data[key] = None

  def load(self):
    if self.is_loaded:
      return

    column_names = self.get_select_fields()
    sql = f'SELECT {column_names} FROM "{self.table_name}" WHERE "{self.primary_key}" = %s LIMIT 1'
    Postgres_DB.fetchone(sql, (self.id, ), self.build_data)

    is_loaded = True

    return self

  def build_data(self, db_record):
    if db_record is None:
      return

    self.data = {}
    for index, field in enumerate(self.allow_fields.keys()):
      # print(index, field, db_record[index])
      if db_record[index] is None:
        self.data[field] = None
      else:
        self.data[field] = str(db_record[index])

  def bind(self, changes):
    for key in changes:
      self.data[key] = changes[key]

  def save(self):
    column_names = []
    sql_params = ()

    for key in self.data:
      column_name = self.allow_fields[key]
      column_names.append(f'"{column_name}"')
      sql_params += (self.data[key],)


    if self.id is None:
      sql_values = ','.join(list(map(lambda x: '%s', sql_params)))
      sql_insert = ','.join(column_names)
      sql = f'INSERT INTO "{self.table_name}"({sql_insert}) VALUES ({sql_values}) RETURNING "{self.primary_key}"'
      print(sql)
      self.id = Postgres_DB.query(sql, sql_params)
    else:
      sql_set = ','.join(list(map(lambda column_name: f'{column_name} = %s', column_names)))
      sql_params += (self.id,)
      sql = f'UPDATE "{self.table_name}" SET {sql_set} WHERE "{self.primary_key}" = %s'
      print(sql)
      print(sql_params)
      Postgres_DB.query(sql, sql_params)


  def delete(self):
    sql = f'DELETE FROM "{self.table_name}" WHERE "{self.primary_key}" = %s'
    params = (self.id,)
    Postgres_DB.query(sql, params)

  def to_json(self):
    self.load()
    json = {**self.data, 'id': self.id}
    return json

  @classmethod
  def find_all(cls):
    sql = f'SELECT "{cls.primary_key}" FROM "{cls.table_name}"'
    return Postgres_DB.fetchall(sql, (), cls.build_object)

  @classmethod
  def find(cls, conditions = '', params = ()):
    sql = f'SELECT "{cls.primary_key}" FROM "{cls.table_name}" WHERE {conditions}'
    return Postgres_DB.fetchall(sql, params, cls.build_object)

  @classmethod
  def build_object(cls, db_record):
    return cls(db_record[0])

  @classmethod
  def get_next_ordering(cls, order_field = 'Ordering'):
    sql = f'SELECT MAX("{order_field}")+1 FROM "{cls.table_name}"'
    result = Postgres_DB.fetchone(sql, ())
    if result:
      print('get_next_ordering', result)
      return result[0]
    else:
      return 1

