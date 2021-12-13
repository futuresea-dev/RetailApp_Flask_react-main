from models.active_record import ActiveRecord
from models.shipping.instance import MethodInstance
from models.shipping.location import ZoneLocation

class ShippingZone(ActiveRecord):
  table_name = "Shipping_Zones"
  primary_key = "ID"
  allow_fields = {
    'name': 'Name',
    'ordering': 'Ordering',
  }

  def __init__(self, id):
    super().__init__(id)
    self.method_instances = None
    self.locations = None

  def get_method_instance_list(self):
    if self.method_instances is None:
      self.method_instances = MethodInstance.find('"Zone ID" = %s', (self.id,))

    return self.method_instances

  def build_method_instance(self, db_record):
    return MethodInstance(db_record[0])

  def get_location_list(self):
    if self.locations is None:
      self.locations = ZoneLocation.find('"Zone ID" = %s', (self.id,))
    return self.locations

  def delete(self):
    # delete shipping method instances
    method_instances = self.get_method_instance_list()
    for method_instance in method_instances:
      method_instance.delete()

    # delete location
    locations = self.get_location_list()
    for location in locations:
      location.delete()

    # delete zone
    super().delete()

  @staticmethod
  def create():
    zone = ShippingZone(None)
    zone.bind({
      'name': 'Everywhere',
      'ordering': ShippingZone.get_next_ordering()
    })
    zone.save()
    return zone

  def bind(self, changes):
    super().bind(changes)