from models.datatable import Datatable

class DatatableBrand(Datatable):
  def build_sql(self):
    sql = 'SELECT "Brand", COUNT("Receipt ID") AS "Sales", SUM("Quantity Sold") AS Units FROM "Sales_by_item" GROUP BY "Brand";'
    return sql

  def field_names(self):
    return ['brand', 'sales', 'units']
