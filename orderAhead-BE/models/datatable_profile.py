from models.datatable import Datatable

class DatatableProfile(Datatable):
  def build_sql(self):
    sql = 'SELECT "Price Profile Name", COUNT("Receipt ID") AS "Sales", SUM("Quantity Sold") AS Units FROM "Sales_by_item" GROUP BY "Price Profile Name";'
    return sql

  def field_names(self):
    return ['profile', 'sales', 'units']
