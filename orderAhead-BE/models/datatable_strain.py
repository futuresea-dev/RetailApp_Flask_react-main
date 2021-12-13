from models.datatable import Datatable

class DatatableStrain(Datatable):
  def build_sql(self):
    sql = 'SELECT "Strain Name", SUM("Weight Sold") FROM "Sales_by_item" GROUP BY "Strain Name";'
    return sql

  def field_names(self):
    return ['strain', 'lbs_sold']
