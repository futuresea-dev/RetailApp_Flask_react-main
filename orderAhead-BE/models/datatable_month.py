from models.datatable import Datatable

class DatatableMonth(Datatable):

  def load_data(self):
    return [
      {'month': 'January', 'lbs_sold': '51.73'},
      {'month': 'February', 'lbs_sold': '47.03'},
      {'month': 'March', 'lbs_sold': '62.75'},
      {'month': 'April', 'lbs_sold': '60.39'},
      {'month': 'May', 'lbs_sold': '52.79'},
      {'month': 'June', 'lbs_sold': '45.16'},
      {'month': 'July', 'lbs_sold': '47.90'},
      {'month': 'August', 'lbs_sold': '40.31'},
      {'month': 'September', 'lbs_sold': '17.21'},
    ]

  def build_sql(self):
    sql = 'SELECT "Product Type", COUNT("Receipt ID") AS "Sales", SUM("Quantity Sold") AS Units FROM "Sales_by_item" GROUP BY "Product Type";'
    return sql

  def field_names(self):
    return ['month', 'lbs_sold']
