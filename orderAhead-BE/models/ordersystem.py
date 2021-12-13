import math
import json
from flask_cors import cross_origin
from flask import Flask, jsonify, request
import requests
import os
from config import app
from models.datatable_factory import DatatableFactory
from models.category import Category
from models.brand import Brand
from models.type import Type
from models.product import Product
from models.product_search import ProductSearch
from models.brand_search import BrandSearch
from models.customer import Customer
from pathlib import Path
from models.product_review import ProductReview
from models.product_type import ProductType
# from models.shipping_zone import ShippingZone
# from models.shipping_manager import ShippingManager
from models.shipping import ShippingFacade
from models.product_media import ProductMedia
from flowhub.api import orderAheadPostCaller

import cv2
import common

facade = ShippingFacade()

@app.route('/ordersystem/loadCategories', methods=['GET'])
@cross_origin()
def os_loadCategories():
    category_list = Category.get_list()
    data = []
    for category in category_list:
      data.append(category.toJSON())

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/ordersystem/loadBrands', methods=['GET', 'POST'])
@cross_origin()
def os_loadBrands():
    content = request.get_json()
    category_name = content.get("category")
    type_name = content.get("type")

    params = {'category': category_name, 'type': type_name}
    search = BrandSearch(params)
    brand_list = search.get_list()
    data = []
    for brand in brand_list:
      data.append(brand.toJSON())

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/ordersystem/loadTypes', methods=['GET', 'POST'])
@cross_origin()
def os_loadTypes():
    content = request.get_json()
    # category_name = content.get("category")
    # brand_name = content.get("brand")
    # type_name = content.get("type")

    type_list = Type.get_list()
    data = []
    for xtype in type_list:
      data.append(xtype.toJSON())

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/ordersystem/countProducts', methods=['GET', 'POST'])
@cross_origin()
def os_countProducts():
  sql = ''


@app.route('/ordersystem/loadProducts', methods=['GET', 'POST'])
@cross_origin()
def os_loadProducts():
  if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

  content = request.get_json()
  category_name = content.get("category")
  brand_name = content.get("brand")
  type_name = content.get("type")
  page = content.get("page")
  ordering = content.get("ordering", 'asc')
  if not page:
    page = 1

  # if category_name:
  #   product_list = Category(category_name).get_products()
  # elif brand_name:
  #   product_list = Brand(brand_name).get_products()
  # elif type_name:
  #   product_list = ProductType(type_name).get_products()

  search = ProductSearch({'category': category_name, 'brand': brand_name, 'type': type_name, 'page': page})

  count = search.get_product_count()
  print('ordering')
  print(ordering)
  product_list = search.get_products({'limit': 10, 'offset': (page-1)*10, 'ordering': ordering})

  data = []
  for product in product_list:
    data.append(product.toJSON())

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data, 'total': math.ceil(count / 10)}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/adminLoadProducts', methods=['GET', 'POST'])
@cross_origin()
def adminLoadProducts():
  if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

  content = request.get_json()
  category_name = content.get("category")
  brand_name = content.get("brand")
  type_name = content.get("type")
  page = content.get("page")
  if not page:
    page = 1

  # if category_name:
  #   product_list = Category(category_name).get_products()
  # elif brand_name:
  #   product_list = Brand(brand_name).get_products()
  # elif type_name:
  #   product_list = ProductType(type_name).get_products()

  search = ProductSearch({'category': category_name, 'brand': brand_name, 'type': type_name, 'page': page})

  count = search.get_product_count()

  product_list = search.get_light_products({'limit': 10, 'offset': (page-1)*10})

  data = []
  for product in product_list:
    data.append(product.toLightJSON())

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data, 'total': math.ceil(count / 10)}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/loadProduct', methods=['GET', 'POST'])
@cross_origin()
def os_loadProduct():
  if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

  content = request.get_json()
  sku = content.get("sku")
  product = Product(sku)
  data = product.toJSON()

  reviews = product.get_reviews()
  print('reviews')
  print(reviews)
  data['reviews'] = reviews

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osLoadType', methods=['GET', 'POST'])
@cross_origin()
def os_loadType():
  if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

  content = request.get_json()
  name = content.get("name")

  productType = Type(name)
  productType.load_data()
  data = productType.toJSON()

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osUpdateType', methods=['GET', 'POST'])
@cross_origin()
def os_updateType():

  type_name = request.form['typeName']
  price_from = request.form['price_from']
  price_to = request.form['price_to']

  type_obj = Type(type_name)
  type_obj.load_data()

  if 'typeThumbnail' in request.files:
    thumbnail_file = request.files['typeThumbnail']
    if thumbnail_file:
      type_obj.image_url = common.save_uploaded_file_to_dir(thumbnail_file, '/uploads/types', thumbnail_file.filename)

  if price_from is None:
    price_from = 0
  if price_to is None:
    price_to = 0

  type_obj.price_from = price_from
  type_obj.price_to = price_to
  type_obj.save()


  update_name = request.form['updateName']
  if update_name != type_name:
    type_obj.update_name(update_name)


  # productType = Type(name)
  # productType.load_data()
  # data = productType.toJSON()
  data = type_obj.toJSON()

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osGetBoughtProductReviews', methods=['GET', 'POST'])
@cross_origin()
def os_getBoughtProductReviews():
  content = request.get_json()
  customer_id = content.get('customer_id')
  customer = Customer(customer_id)
  data = customer.get_bought_product_list()
  print('data')
  print(data)

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osLoadReview', methods=['GET', 'POST'])
@cross_origin()
def os_loadReview():
  content = request.get_json()
  customer_id = content.get('customer_id')
  sku = content.get('sku')

  review = ProductReview(customer_id, sku)
  review.load_data()
  data = review.toJSON()

  print('data')
  print(data)

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osUpdateReview', methods=['GET', 'POST'])
@cross_origin()
def os_updateReview():
  content = request.get_json()
  print(content)

  review = ProductReview(content['customer_id'], content['sku'])
  review.bind_data(content)
  review.save()
  data = review.toJSON()

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osLoadProductTypesByCategory', methods=['GET', 'POST'])
@cross_origin()
def osLoadProductTypesByCategory():
  content = request.get_json()

  result = ProductType.get_list({'category': content.get('category')})
  data = []
  for product_type in result:
    data.append(product_type.toJSON())

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osLoadShippingZone', methods=['GET', 'POST'])
@cross_origin()
def osLoadShippingZone():
  content = request.get_json()
  zone_id = content.get('zone_id')
  data = facade.get_zone(zone_id)

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osLoadShippingZones', methods=['GET', 'POST'])
@cross_origin()
def osLoadShippingZones():
  # content = request.get_json()


  data = facade.get_zone_list()

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osGetShippingMethods', methods=['GET', 'POST'])
@cross_origin()
def osGetShippingMethods():
  params = request.get_json()
  data = facade.to_json(facade.get_method_list())
  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osRecalculatePrice', methods=['GET', 'POST'])
@cross_origin()
def osRecalculatePrice():
  params = request.get_json()
  data = ProductType.recalculate_all_prices()
  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osDeleteMedia', methods=['GET', 'POST'])
@cross_origin()
def osDeleteMedia():
  params = request.get_json()

  data = ProductMedia.delete_media(params.get('media_id'))
  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osUploadMediaFiles', methods=['GET', 'POST'])
@cross_origin()
def osUploadMediaFiles():
  print('osUploadMediaFiles')
  params = request.get_json()
  sku = request.form['sku']
  upload_file = request.files['uploadFile']
  data = False
  if upload_file:
    product_relative_path = '/uploads/products'
    uploaded_file_relative_path = common.save_uploaded_file_to_dir(upload_file, product_relative_path, upload_file.filename)


    # check file extension to detect file type
    filename_without_ext, file_extension = os.path.splitext(upload_file.filename)


    if file_extension == '.mp4':
      file_type = 'video'
      thumbnail_filename = f'{filename_without_ext}_thumbnail.jpg'
    else:
      file_type = 'image'
      thumbnail_filename = upload_file.filename

    thumbnail_relative_path = f'{product_relative_path}/{thumbnail_filename}'



    # generate thumbnail
    if file_type == 'video':
      try:

        video_path = common.get_public_dir(uploaded_file_relative_path)
        vidcap = cv2.VideoCapture(video_path)
        success, image = vidcap.read()

        #save thumbnail
        save_dirs = [common.get_build_dir(product_relative_path), common.get_public_dir(product_relative_path)]
        for save_dir in save_dirs:
          thumbnail_save_path = f'{save_dir}/{thumbnail_filename}'
          cv2.imwrite(thumbnail_save_path, image)     # save frame as JPEG file

      except:
        pass

    data = ProductMedia.add_media(sku, uploaded_file_relative_path, file_type, thumbnail_relative_path)

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response



@app.route('/ordersystem/osLoadProductGallery', methods=['GET', 'POST'])
@cross_origin()
def osLoadProductGallery():
  params = request.get_json()
  sku = params.get('sku')

  data = ProductMedia.get_product_media_items(sku)

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osPlaceOrder', methods=['GET', 'POST'])
@cross_origin()
def osPlaceOrder():
  form_data = request.form
  print(form_data)
  data = orderAheadPostCaller(form_data)

  # data = 'New Order ID'

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osUpdateProduct', methods=['GET', 'POST'])
@cross_origin()
def osUpdateProduct():
  form_data = request.form

  sku = form_data['sku']

  product = Product(sku)
  product.product_name = form_data['product_name']
  product.visibility = form_data['visibility']
  product.save()
  data = product.toJSON()

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osShippingZoneSaveChanges', methods=['GET', 'POST'])
@cross_origin()
def osShippingZoneSaveChanges():
  form_data = request.form
  print('osShippingZoneSaveChanges')
  zone_id = form_data.get('zone_id')
  if zone_id == 'new':
    zone_id = None
  zone_name = form_data.get('zone_name')
  zone_locations = form_data.getlist('zone_locations')
  changes = {
    'name': zone_name,
    'locations': zone_locations
  }

  data = facade.update_zone(zone_id, changes)
  # print('form_data')
  # print(form_data)
  # print(form_data.getlist('zone_locations'))


  # zone_id = form_data['zone_id']

  # zone = ShippingZone()
  # zone.bind(form_data)
  # zone.save()
  # data = zone.toJSON()

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osShippingZoneDelete', methods=['GET', 'POST'])
@cross_origin()
def osShippingZoneDelete():
  params = request.get_json()
  zone_id = params.get('zone_id')

  facade.delete_zone(zone_id)
  data = ''

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osShippingZoneUpdateMethodStatus', methods=['GET', 'POST'])
@cross_origin()
def osShippingZoneUpdateMethodStatus():
  params = request.get_json()
  instance_id = params.get('instance_id')
  is_enabled = params.get('is_enabled')

  data = facade.update_instance_status(instance_id, is_enabled)


  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osShippingZoneInstanceDelete', methods=['GET', 'POST'])
@cross_origin()
def osShippingZoneInstanceDelete():
  params = request.get_json()
  instance_id = params.get('instance_id')

  data = facade.delete_instance(instance_id)


  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response

@app.route('/ordersystem/osLoadMethodInstance', methods=['GET', 'POST'])
@cross_origin()
def osLoadMethodInstance():
  params = request.get_json()
  instance_id = params.get('instance_id')

  data = facade.get_instance(instance_id)


  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osShippingZoneAddMethod', methods=['GET', 'POST'])
@cross_origin()
def osShippingZoneAddMethod():
  form_data = request.form
  method_id = form_data['method_id']
  zone_id = form_data['zone_id']
  if zone_id == 'new':
    zone_id = None
  print('osShippingZoneAddMethod zone_id', zone_id)
  zone = facade.create_method_instance(method_id, zone_id)
  data = zone.to_json()

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osUpdateMethodInstace', methods=['GET', 'POST'])
@cross_origin()
def osUpdateMethodInstace():
  params = request.get_json()
  print('osUpdateMethodInstace')
  instance_id = params.get('instance_id')
  changes = params.get('data')

  data = facade.update_method_instance(instance_id, changes)

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response


@app.route('/ordersystem/osShippingZoneMethodsSaveSettings', methods=['GET', 'POST'])
@cross_origin()
def osShippingZoneMethodsSaveSettings():
  form_data = request.form
  method_id = form_data['instance_id']
  title = form_data['title']
  cost = form_data['cost']

  data = {
    'zone_id': 9,
    'methods': {
      'title': 'Flat rate',
      'id': 'flat_rate',
      'cost': 0,
      'enabled': 'yes',
    },
    'zone_name': 'Everywhere',
  }

  response = app.response_class(
      response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
      status=200,
      mimetype='application/json'
  )
  return response