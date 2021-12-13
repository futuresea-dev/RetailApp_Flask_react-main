from .postgres_db import Postgres_DB


class Datatable:

  def load_data(self):
    sql = self.build_sql()

    result = Postgres_DB.fetchall(sql, (), self.mapping)

    return result

  def mapping(self, record):
    obj = {}
    index = 0
    for field_name in self.field_names():
      obj[field_name] = str(record[index])
      index += 1
    return obj

  def build_sql(self):
    raise NotImplementedError("Please Implement this method")

    # sql = 'SELECT "Brand", COUNT("Receipt ID") AS "Sales", SUM("Quantity Sold") AS Units FROM "Sales_by_item" GROUP BY "Brand";'
    # return sql

  def field_names(self):
    raise NotImplementedError("Please Implement this method")