from models.postgres_db import Postgres_DB

class ProductReview:
  def __init__(self, customer_id, sku):
    self.customer_id = customer_id
    self.sku = sku
    self.img_url = ''
    self.name = ''
    self.rating = 0
    self.content = ''
    self.reviewed_at = ''

  def load_data(self):
    sql = '''
      SELECT i."SKU", i."img_url", concat(i."Product Name", i."Strain Name") as "Name", pr."Rating", pr."Content", pr."Reviewed At"
      FROM "Inventory" AS i
        LEFT JOIN "Product_Reviews" AS pr ON pr."Product Sku" = i."SKU" AND pr."Customer Id" = %s
      WHERE "Product Sku" = %s
      LIMIT 1
    '''

    result = Postgres_DB.fetchone(sql, (self.customer_id, self.sku,))
    if result:
      # self.sku = result[0]
      self.img_url = result[1]
      self.name = result[2]
      self.rating = result[3]
      self.content = result[4]
      self.reviewed_at = result[5]

  def bind_data(self, data):
    self.rating = data['rating']
    self.content = data['content']

  def save(self):
    sql = '''
      INSERT INTO "Product_Reviews" ("Customer Id", "Product Sku", "Rating", "Content", "Reviewed At")
        VALUES (%s, %s, %s, %s, current_timestamp)
      ON CONFLICT ("Customer Id", "Product Sku") DO UPDATE SET "Rating" = %s, "Content" = %s, "Reviewed At" = current_timestamp;
    '''
    Postgres_DB.query(sql, (self.customer_id, self.sku, float(self.rating), self.content,
      float(self.rating), self.content))

  def toJSON(self):
    return {
      'customer_id': self.customer_id,
      'sku': self.sku,
      'name': self.name,
      'img_url': self.img_url,
      'rating': str(self.rating),
      'content': self.content,
      'reviewed_at': str(self.reviewed_at),
    }