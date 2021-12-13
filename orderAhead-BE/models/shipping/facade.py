from models.shipping.zone import ShippingZone
from models.shipping.method import ShippingMethod
from models.shipping.instance import MethodInstance
from models.shipping.location import ZoneLocation

class ShippingFacade:
  def create_method_instance(self, method_id, zone_id = None):
    if zone_id is None:
      zone = ShippingZone.create()
    else:
      zone = ShippingZone(zone_id)

    method = ShippingMethod(method_id)
    return MethodInstance.create(zone, method)

  def delete_method_instance(self, instance_id):
    instance = MethodInstance(instance_id)
    instance.delete()

  def update_method_instance(self, instance_id, changes = {}):
    instance = MethodInstance(instance_id)
    instance.load()
    instance.bind(changes)
    instance.save()
    return instance.to_json()


  def get_method_list(self):
    return ShippingMethod.find_all()

  def create_zone(self, data = {}):
    zone = ShippingZone.create()
    zone.bind(data)
    zone.save()
    return zone

  def update_zone(self, zone_id, changes = {}):
    zone = ShippingZone(zone_id)
    zone.load()
    zone.name = changes['name']
    zone.save()

    # Update location
    if 'locations' in changes:
      codes = changes['locations']
      ZoneLocation.update(zone, codes)

    return zone.to_json()

  def get_zone(self, zone_id):
    zone = ShippingZone(zone_id)
    zone.load()
    json = zone.to_json()

    method_instances = zone.get_method_instance_list()
    for method_instance in method_instances:
      print('method_instance', method_instance.to_json())

    method_instances = self.to_json(method_instances)

    json['method_instances'] = method_instances

    # locations
    json_locations = []
    locations = zone.get_location_list()
    for location in locations:
      location.load()
      json_locations.append(location.code)
    json['locations'] = json_locations

    return json

  def get_zone_list(self):
    zone_list = ShippingZone.find_all()

    data = []
    for zone in zone_list:
      json = zone.to_json()

      shipping_methods = []
      for instance in zone.get_method_instance_list():
        instance.load()
        shipping_methods.append(instance.title)

      regions = []
      for location in zone.get_location_list():
        location.load()
        regions.append(location.code)

      if len(shipping_methods) > 0:
        json['shipping_methods'] = ', '.join(shipping_methods)
      else:
        json['shipping_methods'] = 'No shipping methods offered to this zone.'

      if len(regions) > 0:
        json['regions'] = ', '.join(regions)
      else:
        json['regions'] = 'Everywhere'

      data.append(json)

    return data

  def delete_zone(self, zone_id):
    zone = ShippingZone(zone_id)
    zone.delete()

  def to_json(self, obj_list):
    return list(map(lambda obj: obj.load().to_json(), obj_list))

  def update_instance_status(self, instance_id, is_enabled):
    instance = MethodInstance(instance_id)
    instance.load()
    instance.is_enabled = is_enabled
    instance.save()
    return instance.to_json()

  def delete_instance(self, instance_id):
    instance = MethodInstance(instance_id)
    instance.delete()
    return 'DELETED'

  def get_instance(self, instance_id):
    instance = MethodInstance(instance_id)
    return instance.to_json()