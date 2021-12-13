from models.postgres_db import Postgres_DB
from models.category import Category
from common import sanitize_title, sanitize_handle

class Brand(Category):
  column_name = "Brand"


  def get_link(self):
    link = '/order/products?brand=' + sanitize_title(self.name)
    return link