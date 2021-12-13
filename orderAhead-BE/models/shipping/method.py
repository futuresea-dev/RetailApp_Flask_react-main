from models.active_record import ActiveRecord

class ShippingMethod(ActiveRecord):
  table_name = "Shipping_Methods"
  primary_key = "ID"
  allow_fields = {
    'name': 'Name',
    'ordering': 'Ordering',
  }