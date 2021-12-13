from models.postgres_db import Postgres_DB
from models.base import Base
from models.product import Product
from models.brand import Brand
import json
from common import sanitize_title, sanitize_handle
import time


class Type(Base):
  DEFAULT_IMAGE = '/img/default_type.jpg'
  allow_fields = {
    'name': 'Name',
    'image_url': 'Image_Url',
    'price_from': 'Price From',
    'price_to': 'Price To',
  }

  def __init__(self, name):
    self.id = name
    self.data = {}

  @classmethod
  def get_list(cls, options={}):
    select_fields = cls.get_select_fields()
    sql = f'SELECT {select_fields} FROM "Product_Types" ORDER BY "Updated At" DESC;'
    return Postgres_DB.fetchall(sql, (), cls.build_type)

  def load_data(self):
    select_fields = self.get_select_fields()
    sql = f'SELECT {select_fields} FROM "Product_Types" WHERE "Name" = %s LIMIT 1;'

    Postgres_DB.fetchone(sql, (self.id, ), self.build_data)

  def build_data(self, db_record):
    self.data = {}
    for index, field in enumerate(self.allow_fields.keys()):
      self.data[field] = db_record[index]

    # self.data['price_from'] = 100
    # self.data['price_to'] = 200

    return self.data

  def save(self):
    sql_set = []
    params = ()
    for key, column_name in self.allow_fields.items():
      sql_set.append(f'"{column_name}" = %s')
      params += (self.data[key],)

    sql_set.append(f'"Updated At" = current_timestamp')

    params += (self.id,)

    sql_set = ','.join(sql_set)
    sql = f'UPDATE "Product_Types" SET {sql_set} WHERE "Name" = %s'

    print(sql)
    print(params)

    Postgres_DB.query(sql, params)

  def get_brand_list(self):
    sql = f'SELECT DISTINCT "Brand" FROM "Inventory" WHERE "Product Type" = %s;'

    return Postgres_DB.fetchall(sql, (self.id,), Brand.build_category)

  @classmethod
  def build_type(cls, db_record):
    product_type = cls(db_record[0])
    product_type.build_data(db_record)
    return product_type

  def toJSON(self):
    if not self.image_url:
      self.image_url = Type.DEFAULT_IMAGE


    return {
      'name':self.name,
      'thumbnail': self.image_url,
      'handle': sanitize_handle(self.name),
      'price_range': {
        'from': self.price_from,
        'to': self.price_to
      },
      'brands': 'hello',
    }

  def update_name(self, new_name):
    sql = f'UPDATE "Product_Types" SET "Name" = %s WHERE "Name" = %s;'
    sql += f'UPDATE "Inventory" SET "Product Type" = %s WHERE "Product Type" = %s;'
    Postgres_DB.query(sql, (new_name, self.name, new_name, self.name,))
