from models.postgres_db import Postgres_DB
from models.category import Category
from common import sanitize_title, sanitize_handle
from models.product_search import ProductSearch
from models.brand import Brand
import sys
class ProductType(Category):
  column_name = "Product Type"

  def get_link(self):
    link = '/order/products?type=' + sanitize_title(self.name)
    return link

  @staticmethod
  def recalculate_all_prices():
    type_list1 = ProductType.get_list_has_tier_price()
    type_list2 = ProductType.get_list_without_tier_price()
    type_list = type_list1 + type_list2
    print('type_list1', type_list1)

    sql = ''
    for item in type_list:
      sql += ProductType.get_update_type_sql(item['name'], item['min_price'], item['max_price'])

    Postgres_DB.query(sql)


  @staticmethod
  def get_min_tierprice(product):
    min_price = sys.maxsize
    if len(product.tier_prices)>0:
      for tier_price in product.tier_prices:
        if min_price>tier_price['pricePerUnitInMinorUnits']: min_price = tier_price['pricePerUnitInMinorUnits']
    else:
      min_price = 0
    return min_price

  @staticmethod
  def get_max_tierprice(product):
    max_price = 0

    if len(product.tier_prices)>0:
      for tier_price in product.tier_prices:
        if max_price<tier_price['pricePerUnitInMinorUnits']: max_price = tier_price['pricePerUnitInMinorUnits']

    return max_price

  @staticmethod
  def update_min_max(db_record):
    type_name = db_record[0]
    search = ProductSearch({'type': type_name})
    products = search.get_products({'limit': 0, 'offset': 0})

    min_price = sys.maxsize
    max_price = 0

    has_product = False
    for product in products:
      has_product = True
      min_tierprice = ProductType.get_min_tierprice(product)
      max_tierprice = ProductType.get_max_tierprice(product)

      if min_price>min_tierprice: min_price = min_tierprice
      if max_price<max_tierprice: max_price = max_tierprice

    if not has_product: min_price = 0

    return {
      'name': type_name,
      'min_price': min_price / 100,
      'max_price': max_price / 100,
    }

  @staticmethod
  def get_list_has_tier_price():
    sql = 'SELECT DISTINCT "Product Type" FROM "Inventory" WHERE "Price" IS NULL AND "Product Type" IS NOT NULL;'
    return Postgres_DB.fetchall(sql, (), ProductType.update_min_max)

  @staticmethod
  def get_list_without_tier_price():
    sql = 'SELECT "Product Type", MIN("Price"), MAX("Price") FROM "Inventory" GROUP BY "Product Type" HAVING "Product Type" IN (SELECT DISTINCT i."Product Type" FROM "Inventory" AS i WHERE i."Price" IS NOT NULL AND i."Product Type" IS NOT NULL);'
    return Postgres_DB.fetchall(sql, (), lambda db_record: {'name': db_record[0], 'min_price': db_record[1], 'max_price': db_record[2], })


  @staticmethod
  def get_update_type_sql(type_name, min_price, max_price):
    sql = f'''
      INSERT INTO "Product_Types" ("Name", "Price From", "Price To", "Updated At")
        VALUES ('{type_name}', {min_price}, {max_price}, current_timestamp)
      ON CONFLICT ("Name") DO UPDATE SET "Name" = '{type_name}', "Price From" = {min_price}, "Price To" = {max_price}, "Updated At" = current_timestamp;
    '''
    return sql


  @classmethod
  def get_list(cls, options={}):
    condition = cls.createCondition(options)
    sql_where = condition['sql']
    if sql_where:
      sql_where += ' AND '

    sql = f'''
      SELECT pt."Name", pt."Image_Url", pt."Price From", pt."Price To"
      FROM "Product_Types" AS pt
      WHERE pt."Name" IN (
          SELECT DISTINCT "{cls.column_name}"
          FROM "Inventory"
          WHERE {sql_where} "{cls.column_name}" IS NOT NULL AND "Room" = \'Sales Floor\'
        );
    '''
    return Postgres_DB.fetchall(sql, condition['params'], cls.build_type)

  @classmethod
  def build_type(cls, record):
    default_thumb = 'https://images.dutchie.com/d11298aa71b42ac444034a303c204d6a?auto=format&fit=fill&fill=solid&fillColor=%23fff&__typename=ImgixSettings&ixlib=react-9.0.2&h=175&w=175'
    product_type = cls(record[0])
    product_type.thumbnail = record[1] if record[1] is not None else default_thumb
    product_type.price_from = record[2]
    product_type.price_to = record[3]
    return product_type

  @classmethod
  def createCondition(cls, options):
    sql = []
    params = ()
    if 'category' in options and options['category']:
      sql.append('"Category"=%s')
      params = params + (options['category'],)
    if 'brand' in options and options['brand']:
      sql.append('"Brand"=%s')
      params = params + (options['brand'],)

    sql = ' AND '.join(sql)


    return {'sql':sql, 'params': params}



  def toJSON(self):
    brand_list = self.get_brand_list()
    brand_text = ', '.join(list(map(lambda x: x.name, brand_list)))
    return {
      'name':self.name,
      'thumbnail': self.thumbnail,
      'price_from': self.price_from,
      'price_to': self.price_to,
      'link': self.get_link(),
      'handle':sanitize_handle(self.name),
      'brands': brand_text,
    }

  def get_brand_list(self):
    sql = f'SELECT DISTINCT "Brand" FROM "Inventory" WHERE "Product Type" = %s;'

    return Postgres_DB.fetchall(sql, (self.name,), Brand.build_category)

  def get_brands(self):
    print('get_brands')