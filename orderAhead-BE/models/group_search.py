from models.postgres_db import Postgres_DB
from common import fix_quote

class GroupSearch:
  search_column = None
  build_callback = None
  def __init__(self, params):
    self.params = params

  def get_list(self,  options = {'limit': 50, 'offset': 0}):
    select_fields = self.search_column
    limit = options['limit']
    offset = options['offset']

    wherePart = self.createSearchCondition()
    sqlCondition = wherePart['sql']
    if sqlCondition:
      sqlCondition += ' AND '

    sql = f'SELECT DISTINCT "{select_fields}" FROM "Inventory" WHERE {sqlCondition} "Room" = \'Sales Floor\' LIMIT {limit} OFFSET {offset}'
    print(sql)
    print(wherePart['params'])

    return Postgres_DB.fetchall(sql, wherePart['params'], self.build_callback)

  def createSearchCondition(self):
    sql = []
    params = ()
    if 'category' in self.params and self.params['category']:
      sql.append('"Category"=%s')
      params = params + (self.params['category'],)
    if 'brand' in self.params and self.params['brand']:
      sql.append('"Brand"=%s')
      params = params + (self.params['brand'],)
    if 'type' in self.params and self.params['type']:
      sql.append('"Product Type"=%s')
      params = params + (self.params['type'],)

    sql = ' AND '.join(sql)


    return {'sql':sql, 'params': params}