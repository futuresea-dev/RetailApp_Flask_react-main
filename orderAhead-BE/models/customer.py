from .postgres_db import Postgres_DB

class Customer:
    customer_id = 0
    def __init__(self, customer_id = 0):
      self.customer_id = customer_id
      pass

    def load_data(self):
      sql = 'SELECT "Med ID Exp" FROM "Customers" WHERE "Customer ID" = %s LIMIT 1;'
      Postgres_DB.fetchone(sql, (self.customer_id,), self.build_customer)

    def build_customer(self, db_record):
      self.med_id_exp = db_record[0]

    @classmethod
    def create_by_medical_id(cls, med_id):
      print(f'SELECT "Customer ID" FROM "Customers" WHERE "Customer Med ID" = \'{med_id}\';')
      result = Postgres_DB.fetchone(f'SELECT "Customer ID" FROM "Customers" WHERE "Customer Med ID" = \'{med_id}\';')

      if result:
        customer_id = result[0]

        return cls(customer_id)
      else:
        return None


    def get_all_receipts(self):
      sql = f'SELECT "Transaction Date", "Receipt Total", "Employee Name", "Receipt ID" FROM "Sales" WHERE "Customer ID" = \'{self.customer_id}\';'
      print(sql)
      result = Postgres_DB.fetchall(sql)

      receipt_list = []
      for record in result:
        receipt_id = record[3]
        receipt = {
            'date': record[0],
            'total': record[1],
            'employee': record[2],
            'receipt_id': receipt_id,
        }
        receipt['items'] = self.get_items_by_receipt(receipt_id)

        receipt_list.append(receipt)

      print('done query')

      return receipt_list

    def get_items_by_receipt(self, receipt_id):
      sql = f'SELECT "Quantity Sold", "Product Name", "Category", "Price", "Tax in Dollars", "Receipt Total" FROM "Sales_by_item" WHERE "Receipt ID" = \'{receipt_id}\';'
      print(sql)
      result = Postgres_DB.fetchall(sql)

      item_list = []
      for record in result:
        item = {
            'qty': record[0],
            'name': record[1],
            'category': record[2],
            'price': record[3],
            'tax': record[4],
            'total': record[5],
        }
        item_list.append(item)

      return item_list

    def get_bought_product_list(self):
      sql = """
        SELECT DISTINCT sbi."SKU", i."img_url", concat(i."Product Name", i."Strain Name") AS "Name", pr."Rating", pr."Content"
        FROM "Sales_by_item" AS sbi
          LEFT JOIN "Product_Reviews" AS pr ON sbi."SKU" = pr."Product Sku"
          LEFT JOIN "Inventory" AS i ON sbi."SKU" = i."SKU"
        WHERE sbi."Receipt ID" IN (SELECT DISTINCT s."Receipt ID" FROM "Sales" AS s WHERE s."Customer ID" = %s);
      """

      result = Postgres_DB.fetchall(sql, (self.customer_id, ), self.build_review)


      return result

    def build_review(self, db_record):
      return {
        'sku': db_record[0],
        'img_url': db_record[1],
        'name': db_record[2],
        'rating': str(db_record[3]),
        'content': db_record[4],
      }

    def get_last_purchases_by_date(self):
      result = []
      try:
        receipt_list = self.get_all_receipts()


        # group1 = {
        #     'date': '8/27/2021',
        #     'total': 10,
        #     'employee': '<employee1>',
        #     'receipt_id': '<receipt_id1>',
        #     'items': [
        #         {
        #             'qty': 1,
        #             'name': '<item name>',
        #             'category': 'Northwoods Wellness',
        #             'price': 0,
        #             'tax': 0,
        #             'total': 0,
        #         },
        #         {
        #             'qty': 10,
        #             'name': '<item name2>',
        #             'category': 'Northwoods Wellness3',
        #             'price': 30,
        #             'tax': 40,
        #             'total': 20,
        #         },
        #     ],
        # }
        # }

        # db.close()
      except Exception as e:
        print('Exception', e)


      return receipt_list

