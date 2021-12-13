from models.postgres_db import Postgres_DB
from models.base import Base
from models.product import Product
import json
from common import sanitize_title, sanitize_handle

class Category(Base):
  column_name = "Category"
  def __init__(self, name):
    self.name = name

  @classmethod
  def get_list(cls, options={}):
    sql = f'SELECT DISTINCT "{cls.column_name}" FROM "Inventory" WHERE "{cls.column_name}" IS NOT NULL AND "Room" = \'Sales Floor\';'
    return Postgres_DB.fetchall(sql, (), cls.build_category)

  @classmethod
  def build_category(cls, record):
    return cls(record[0])

  def get_products(self, options = {'limit': 10, 'offset': 0}):
    select_fields = Product.get_select_fields()
    limit = options['limit']
    offset = options['offset']
    sql = f'SELECT {select_fields} FROM "Inventory" WHERE "{self.column_name}" = %s AND "Room" = \'Sales Floor\' LIMIT {limit} OFFSET {offset}'

    return Postgres_DB.fetchall(sql, (self.name, ), Product.build_product)

  def top_products(self, options = {'limit': 10, 'offset': 0}):
    select_fields = Product.get_select_fields()
    limit = options['limit']
    offset = options['offset']
    sql = f'SELECT {select_fields} FROM "Inventory" WHERE "{self.column_name}" = %s AND "Room" = \'Sales Floor\' LIMIT {limit} OFFSET {offset}'

    return Postgres_DB.fetchall(sql, (self.name, ), Product.build_product)

  def get_link(self):
    link = '/order/products?category=' + sanitize_title(self.name)
    return link

  def toJSON(self):
    image_urls = {
      'Flower': 'https://images.dutchie.com/category-stock-photos/flower/flower-2.png?auto=format&ixlib=react-9.0.2&w=1946',
      'Pre-Rolls': 'https://images.dutchie.com/152d97108f9e4d1a1a911ff3b10c7a54?auto=format&ixlib=react-9.0.2&w=1946',
      'Vaporizers': 'https://images.dutchie.com/category-stock-photos/vaporizers/vaporizers-1.png?auto=format&ixlib=react-9.0.2&w=1946',
      'Concentrate': 'https://images.dutchie.com/ddd46bbc19a23fafbd4eaed16647b5ba?auto=format&ixlib=react-9.0.2&w=1946',
      'Edible': 'https://images.dutchie.com/category-stock-photos/edibles/edibles-1.png?auto=format&ixlib=react-9.0.2&w=1946',
      'CBD': 'https://images.dutchie.com/category-stock-photos/cbd/cbd.png?auto=format&ixlib=react-9.0.2&w=1946',
      'Accessory': 'https://images.dutchie.com/category-stock-photos/cbd/cbd.png?auto=format&ixlib=react-9.0.2&w=1946',
      'NonEdible': 'https://images.dutchie.com/category-stock-photos/cbd/cbd.png?auto=format&ixlib=react-9.0.2&w=1946',
      'Flower - Bulk': 'https://images.dutchie.com/category-stock-photos/flower/flower-2.png?auto=format&ixlib=react-9.0.2&w=1946',
      'Flower - Prepackaged': 'https://images.dutchie.com/category-stock-photos/flower/flower-2.png?auto=format&ixlib=react-9.0.2&w=1946',
    }
    thumbnail = ''
    if self.name in image_urls:
      thumbnail = image_urls[self.name]

    return {'name':self.name, 'thumbnail': thumbnail, 'link': self.get_link(), 'handle':sanitize_handle(self.name)}