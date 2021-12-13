from models.datatable import Datatable

class DatatableCategory(Datatable):
  def build_sql(self):
    sql = 'SELECT "Category", COUNT("Receipt ID") AS "Sales", SUM("Quantity Sold"), SUM("Weight Sold") AS Units FROM "Sales_by_item" GROUP BY "Category";'
    return sql

  def field_names(self):
    return ['category', 'sales', 'units', 'gms_sold']
