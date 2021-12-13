from models.postgres_db import Postgres_DB
from models.product import Product
from common import fix_quote

class ProductSearch:
  def __init__(self, params):
    self.params = params

  def get_products(self, options = {'limit': 10, 'offset': 0, 'ordering': 'asc'}):
    select_fields = Product.get_select_fields()
    limit = options['limit']
    offset = options['offset']

    wherePart = self.createSearchCondition()
    sqlCondition = wherePart['sql']
    if sqlCondition:
      sqlCondition += ' AND  "Room" = \'Sales Floor\' AND "Visibility" = TRUE'
    else:
       sqlCondition = '"Room" = \'Sales Floor\' AND "Visibility" = TRUE'

    sql = f'''
      SELECT {select_fields}, review."AvgRating"
      FROM "Inventory" AS i
      LEFT JOIN (
        SELECT "Product Sku", AVG("Rating")::numeric(10,1) AS "AvgRating" FROM "Product_Reviews" GROUP BY "Product Sku"
      ) AS review ON review."Product Sku" = i."SKU"
      WHERE {sqlCondition}
      ORDER BY "Price" {options['ordering']}
    '''
    print(sql)

    if limit > 0:
      sql += f'LIMIT {limit} OFFSET {offset}'

    product_list = Postgres_DB.fetchall(sql, wherePart['params'], self.build_product)
    product_list = filter(lambda x: x.price is not None or len(x.tier_prices) > 0, product_list)

    return product_list

  def get_light_products(self, options = {'limit': 10, 'offset': 0}):
    select_fields = Product.get_select_fields()
    limit = options['limit']
    offset = options['offset']

    wherePart = self.createSearchCondition()
    sqlCondition = wherePart['sql']
    if sqlCondition:
      sqlCondition += ' AND  "Room" = \'Sales Floor\''
    else:
       sqlCondition = '"Room" = \'Sales Floor\''

    sql = f'''
      SELECT {select_fields}
      FROM "Inventory" AS i
      WHERE {sqlCondition}
    '''

    if limit > 0:
      sql += f'LIMIT {limit} OFFSET {offset}'

    product_list = Postgres_DB.fetchall(sql, wherePart['params'], self.build_light_product)

    return product_list


  def get_product_count(self):
    wherePart = self.createSearchCondition()
    sqlCondition = wherePart['sql']
    if sqlCondition:
      sqlCondition += ' AND  "Room" = \'Sales Floor\''
    else:
       sqlCondition = '"Room" = \'Sales Floor\''

    sql = f'''
      SELECT count("SKU")
      FROM "Inventory"
      WHERE {sqlCondition}
    '''

    result = Postgres_DB.fetchone(sql, wherePart['params'])
    return result[0]


  def build_product(self, db_record):
    product = Product.build_product(db_record)
    product.rating = db_record[len(Product.allow_fields)]

    return product

  def build_light_product(self, db_record):
    product = Product.build_light_product(db_record)

    return product

  def createSearchCondition(self):
    sql = []
    params = ()
    if 'category' in self.params and self.params['category']:
      sql.append('"Category"=%s')
      params = params + (self.params['category'],)
    if 'brand' in self.params and self.params['brand']:
      sql.append('"Brand"=%s')
      params = params + (self.params['brand'],)
    if 'type' in self.params and self.params['type']:
      sql.append('"Product Type"=%s')
      params = params + (self.params['type'],)

    sql = ' AND '.join(sql)


    return {'sql':sql, 'params': params}