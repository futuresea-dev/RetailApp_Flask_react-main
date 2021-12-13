from models.sqllite_db import SqlLite_DB

class User(object):
  id = 0
  data = {}
  # Med ID, Address 1, Address 2, City, Zip, Phone Number, Last Purchase Date
  # T id, first_name, password, last_name, is_active, is_superuser, role, email, phone_number, username, mfa, fullname, med_id, birth_date
  allow_fields = ['username', 'password', 'is_superuser', 'is_active', 'mfa', 'fullname', 'birth_date', 'verif_code',
    'first_name', 'last_name', 'email', 'role', 'med_id', 'address_1', 'address_2', 'city', 'zip', 'phone_number', 'last_purchase_date']
  def __init__(self, user_id = 0):
    self.id = user_id


    if int(user_id) > 0:
      self.load_data()

  def load_data(self):
    sql = f'SELECT * FROM users WHERE id = {self.id}'

    result = SqlLite_DB.fetchone(sql)
    if result:
      self.data = { field: result[field] for field in self.allow_fields }


  def save(self):
    if self.id > 0:
      pairs = [f'{field}=\'{value}\'' if value is not None else f'{field}=NULL' for field, value in self.data.items()]
      set_sql = ','.join(pairs)

      sql = f'UPDATE users SET {set_sql} WHERE id = {self.id}'
      print(sql)
      SqlLite_DB.query(sql)
    else:
      print('TODO: insert user')
      sql = ''

  def __getattr__(self, name):
    if name in self.data:
      return self.data[name]
    else:
      return super().__getattr__(name)

  def __setattr__(self, name, value):
    if name in self.allow_fields:
      self.data[name] = value
    else:
      super().__setattr__(name, value)