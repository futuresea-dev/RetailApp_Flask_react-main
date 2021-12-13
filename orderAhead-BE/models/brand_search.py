from models.group_search import GroupSearch
from models.brand import Brand

class BrandSearch(GroupSearch):
  search_column = 'Brand'
  build_callback = Brand.build_category