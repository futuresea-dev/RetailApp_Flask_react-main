from models.datatable import Datatable

class DatatableProductType(Datatable):
  def build_sql(self):
    sql = 'SELECT "Product Type", COUNT("Receipt ID") AS "Sales", SUM("Quantity Sold") AS Units, "Category"  FROM "Sales_by_item" GROUP BY "Product Type", "Category";'
    return sql

  def field_names(self):
    return ['product_type', 'sales', 'units', 'category']
