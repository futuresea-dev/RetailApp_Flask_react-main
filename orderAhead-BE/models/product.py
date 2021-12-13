from .postgres_db import Postgres_DB
from common import sanitize_title
from models.base import Base
from flowhub.api import findAllInventoryNonZero
from models.product_media import ProductMedia

class Product(Base):
  FLOWER_CAT = 'Flower - Prepackaged'
  allow_fields = {
    'sku': 'SKU',
    'batch_id': 'Batch ID',
    'brand': 'Brand',
    'calculated_weight_grams': 'Calculated Weight (Grams)',
    'category': 'Category',
    'cost_per_gram': 'Cost per Gram',
    'cost_per_item': 'Cost per Item',
    'created_on': 'Created On',
    'current_date': 'Current Date',
    'current_quantity': 'Current Quantity',
    'days_until_expires': 'Days Until Expires',
    'expiration_date': 'Expiration Date',
    'initial_quantity': 'Initial Quantity',
    'last_audit_date': 'Last Audit Date',
    'location': 'Location',
    'package_id': 'Package ID',
    'price': 'Price',
    'price_profile': 'Price Profile',
    'product_name': 'Product Name',
    'product_type': 'Product Type',
    'room': 'Room',
    'source_license': 'Source License',
    'strain_name': 'Strain Name',
    'supplier_name': 'Supplier Name',
    'total_cost': 'Total Cost',
    'total_price': 'Total Price',
    'unit_of_measure': 'Unit of Measure',
    'weight_unit': 'Weight Unit',
    'insert_datetime': 'insert_datetime',
    'img_url': 'img_url',
    'product_description': 'product_description',
    'visibility': 'Visibility',
  }

  all_tier_information = None

  @classmethod
  def get_all_tier_information(cls):
    if cls.all_tier_information is None:
      cls.all_tier_information = []
      response = findAllInventoryNonZero()
      data = response['data']
      if len(data) > 0:
        cls.all_tier_information = list(filter(lambda x: len(x['weightTierInformation'])>0, data))

    return cls.all_tier_information

  @classmethod
  def get_product_tier_information(cls, product_sku):
    all_tier_information = cls.get_all_tier_information()
    tier_information = list(filter(lambda x: x['sku'] == product_sku, all_tier_information))
    if len(tier_information) > 0:
      return tier_information[0]['weightTierInformation']
    else:
      return []

  def __init__(self, sku = ''):
    self.id = sku
    self.data = {}
    self.tier_prices = []
    if len(sku) > 0:
      self.load_data()

  def load_data(self):
    select_fields = self.get_select_fields()
    sql = f'SELECT {select_fields} FROM "public"."Inventory" WHERE "SKU" = %s LIMIT 1 '

    Postgres_DB.fetchone(sql, (self.id, ), self.build_data)

  def build_data(self, db_record):
    if db_record is None:
        return {}

    self.data = {}
    for index, field in enumerate(self.allow_fields.keys()):
      # setattr(self, field, db_record[index])
      self.data[field] = db_record[index]

    self.tier_prices = Product.get_product_tier_information(self.data['sku'])

    return self.data

  def get_reviews(self):
    sql = '''
      SELECT DISTINCT pr."Rating", pr."Content", pr."Reviewed At", c."Customer Name"
      FROM "Product_Reviews" AS pr
        INNER JOIN "Customers" AS c ON c."Customer ID" = pr."Customer Id"
      WHERE pr."Product Sku" = %s
    '''

    return Postgres_DB.fetchall(sql, (self.id, ), self.build_review)

  def build_review(self, db_record):
    return {
      'rating': str(db_record[0]),
      'content': db_record[1],
      'reviewed_at': str(db_record[2]),
      'customer_name': db_record[3],
    }

  @classmethod
  def build_product(cls, db_record):
    product = cls()
    product.build_data(db_record)

    return product

  @classmethod
  def build_light_product(cls, db_record):
    product = cls()

    product.data = {}
    for index, field in enumerate(cls.allow_fields.keys()):
      product.data[field] = db_record[index]


    return product

  def get_link(self):
    link = '/order/product/' + self.sku
    return link

  def get_type_link(self):
    link = '/order/type/' + self.product_type
    return link

  def in_flower_cat(self):
    return self.category == self.FLOWER_CAT

  def toJSON(self):
    thumbnail = '/img/default_product.jpg'
    if self.img_url:
      thumbnail = self.img_url
    return {
      'sku': self.sku,
      'name': self.strain_name if self.in_flower_cat() else self.product_name,
      'thumbnail': thumbnail,
      'price': self.price,
      'brand': self.brand,
      'type': self.product_type,
      'strain': self.strain_name,
      'desc': self.product_description,
      'link': self.get_link(),
      'type_link': self.product_type,
      'is_flower': self.in_flower_cat(),
      'tier_prices': self.tier_prices,
      'rating': self.data['rating'] if 'rating' in self.data is not None else 0,
      'images': self.get_all_media_items(),
      'visibility': self.visibility,
    }

  def toLightJSON(self):
    thumbnail = '/img/default_product.jpg'
    if self.img_url:
      thumbnail = self.img_url
    return {
      'sku': self.sku,
      'name': self.strain_name if self.in_flower_cat() else self.product_name,
      'thumbnail': thumbnail,
      'price': self.price,
      'brand': self.brand,
      'type': self.product_type,
      'strain': self.strain_name,
      'desc': self.product_description,
      'link': self.get_link(),
      'type_link': self.product_type,
      'is_flower': self.in_flower_cat(),
    }

  def save(self):
    sql_set = []
    params = ()

    update_fields = {
      'product_name': 'Product Name',
      'visibility': 'Visibility',
    }

    for key, column_name in update_fields.items():
      sql_set.append(f'"{column_name}" = %s')
      params += (self.data[key],)

    params += (self.sku,)

    sql_set = ','.join(sql_set)

    sql = f'UPDATE "Inventory" SET {sql_set} WHERE "SKU" = %s'
    Postgres_DB.query(sql, params)

  def get_all_media_items(self):
    return ProductMedia.get_product_media_items(self.sku)