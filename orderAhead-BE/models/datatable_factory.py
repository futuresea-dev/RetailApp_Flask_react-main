from models.datatable_brand import DatatableBrand
from models.datatable_category import DatatableCategory
from models.datatable_month import DatatableMonth
from models.datatable_product_type import DatatableProductType
from models.datatable_profile import DatatableProfile
from models.datatable_strain import DatatableStrain

class DatatableFactory:
  def create(self, data_type):
    instance = None
    if data_type == 'brand':
      instance = DatatableBrand()
    elif data_type == 'category':
      instance = DatatableCategory()
    elif data_type == 'month':
      instance = DatatableMonth()
    elif data_type == 'productType':
      instance = DatatableProductType()
    elif data_type == 'profile':
      instance = DatatableProfile()
    elif data_type == 'strain':
      instance = DatatableStrain()

    return instance