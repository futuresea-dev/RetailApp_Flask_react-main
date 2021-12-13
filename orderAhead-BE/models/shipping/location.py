from models.active_record import ActiveRecord

class ZoneLocation(ActiveRecord):
  table_name = "Shipping_Zone_Locations"
  primary_key = "ID"
  allow_fields = {
    'code': 'Location Code',
    'type': 'Location Type',
    'zone_id': 'Zone ID',
  }

  @staticmethod
  def update(zone, update_codes):
    locations = zone.get_location_list()
    for location in locations:
      location.delete()

    for code in update_codes:
      loc = ZoneLocation(None)
      loc.bind({
        'code': f'{code}',
        'type': 'state',
        'zone_id': zone.id
      })
      loc.save()

  # def get_name(self):
  #   if not self.is_loaded:
  #     self.load()

  #   sql = 'SELECT * '