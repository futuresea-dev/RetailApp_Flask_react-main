from models.postgres_db import Postgres_DB
from models.shipping_zone import ShippingZone

class ShippingManager:
  @staticmethod
  def get_available_methods(params):
    country = params['country']
    state = params['state']
    city = params['city']

    sql_params = ()
    criteria = []

    # country
    criteria.append('( ("Location Type" = \'country\' AND "Location Code" = %s)')
    sql_params += (country,)
    # state
    criteria.append('OR ("Location Type" = \'state\' AND "Location Code" = %s)')
    sql_params += (state,)

    # other
    criteria.append('OR ( "Location Type" IS NULL ) )')


    # postcode_locations = Postgres_DB.fetchall( 'SELECT "Zone ID", "Location Code" FROM "Shipping_Zone_Locations" WHERE "Location Type" = \'postcode\';' )

    # print('postcode_locations', postcode_locations)
    # data = []
    # if postcode_locations:
    #   zone_ids_with_postcode_rules = list(map(lambda item: item[0], postcode_locations))
    #   matches                      = ShippingManager.get_postcode_location_matcher( $postcode, $postcode_locations, 'zone_id', 'location_code', $country );
    #   print('zone_ids_with_postcode_rules')
    #   print(zone_ids_with_postcode_rules)
    #   pass

    sql_where_part = ' '.join(criteria)
    sql = f'''
      SELECT zones."Zone ID" FROM "Shipping_Zones" as zones
      LEFT OUTER JOIN "Shipping_Zone_Locations" as locations ON zones."Zone ID" = locations."Zone ID" AND "Location Type" != 'postcode'
      WHERE {sql_where_part}
      ORDER BY "Zone Order" ASC, zones."Zone ID" ASC LIMIT 1
    '''

    print(sql)
    print(sql_params)

    # Get matching zones.
    result = Postgres_DB.fetchone(sql, sql_params)

    if result:
      data = ShippingZone.get_shipping_methods(result[0])
    else:
      data = []

    # data = [
    #   {'id': 'flat', 'name': 'Shiping name 1'},
    #   {'id': 'flat2', 'name': 'Shiping name 2'},
    # ]

    return data