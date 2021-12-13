# from __main__ import app
from flask import Flask, jsonify, request
import requests
import os
from config import app


'''
export CLIENT_ID="868"
export KEY="1f3ad7b4-35a3-4473-9240-40a1ee40dc74"
'''
client = os.environ.get('CLIENT_ID')
key = os.environ.get('KEY')
#we will comment the below
client = '868'
key = '1f3ad7b4-35a3-4473-9240-40a1ee40dc74'

baseOrderAheadUrl = f'https://api.flowhub.co'
baseOrderUrl = 'https://api.flowhub.co/v1/orders'
baseCustomerUrl= 'https://api.flowhub.co/v1/customers'
headers = {'Clientid':  client, 'Key': key}


#----------------ORDER----------------
@app.route("/orders/findByCustomerId", methods=["GET"])
def findOrderByCustomer():
    try:
        id = request.args.get('id')#customerId
        url = baseOrderUrl + f'/findByCustomerId/{id}'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
       return jsonify({'message': 'Server Error'})

@app.route("/orders/findByLocationId", methods=["GET"])
def findByLocationId():
    try:
        id = request.args.get('id')#importId
        url = baseOrderUrl + f'/findByLocationId/{id}'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
       return jsonify({'message': 'Server Error'})

@app.route("/orders/findByPhoneNumber", methods=["GET"])
def findByPhoneNumber():
    try:
        orderBy = request.args.get('order')
        page = request.args.get('page')
        size = request.args.get('size')
        phone = request.args.get('phone')
        url = baseOrderUrl + f'/findByPhoneNumber/?order_by={orderBy}&page={page}&page_size={size}&phone_number={phone}'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
       return jsonify({'message': 'Server Error'})

#----------------ORDER AHEAD----------------
@app.route("/order-ahead/v1", methods=["POST"])
def orderAheadPost():
    try:
        url = baseOrderAheadUrl + '/order-ahead/v0/create'
        print(url)
        data = request.get_json()
        #city = data['address']['city']
        response = requests.post(url, data=data,headers=headers)
        return response.json()
    except:
       return jsonify({'message': 'Server Error'})

def orderAheadPostCaller(formData):
    try:
        url = baseOrderAheadUrl + '/order-ahead/v0/create'
        print(url)
        response = requests.post(url, data=formData,headers=headers)
        return response.json()
    except:
       return jsonify({'message': 'Server Error'})


@app.route("/orders", methods=["PATCH"])
def orderAheadPatch():
    try:
        id = request.args.get('id')#orderId
        url = baseOrderAheadUrl + f'/orders/{id}'
        print(url)
        data = request.get_json()
        response = requests.patch(url, data=data,headers=headers)
        return response.json()
    except:
       return jsonify({'message': 'Server Error'})

@app.route("/order-ahead/v1/orderStatus", methods=["GET"])
def orderAheadStatus():
    try:
        id = request.args.get('id')#orderId
        url = baseOrderAheadUrl + f'/order-ahead/v0/orderStatus/{id}'
        #Add Bearer Token
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

 #----------------Customers----------------
@app.route("/customers/v1/findByPhoneNumber", methods=["GET"])
def findCustomerByPhone():
    try:
        phone = request.args.get('phone')
        url = baseCustomerUrl + f'/findByPhoneNumber?phone_number={phone}'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/customers/v1/findById", methods=["GET"])
def findCustomerById():
    try:
        custId = request.args.get('id')
        url = baseCustomerUrl + f'/?customer_id={custId}'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/customers/v1/findCustomers", methods=["GET"])
def findCustomers():
    try:
        after = request.args.get('createdBefore')
        before = request.args.get('createdAfter')
        order = request.args.get('order')
        page = request.args.get('page')
        size = request.args.get('size')
        url = baseCustomerUrl + f'/?created_after={after}&created_before={before}&order_by={order}&page={page}&page_size={size}'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})
 #----------------Rooms-------------------
@app.route("/room/inventoryWithRoom", methods=["GET"])
def inventoryWithRoom():
    try:
        url = 'https://api.flowhub.co/v0/inventoryByRooms'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/room/inventoryByLocationWithRoom", methods=["GET"])
def inventoryByLocationWithRoom():
    try:
        locId = request.args.get('id')
        url = f'https://api.flowhub.co/v0/locations/{locId}/inventoryByRooms'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/room/nonZeroInventoryWithRooms", methods=["GET"])
def nonZeroInventoryWithRooms():
    try:
        url = 'https://api.flowhub.co/v0/inventoryByRoomsNonZero'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/room/nonZeroInventoryByLocation", methods=["GET"])
def nonZeroInventoryByLocation():
    try:
        locId = request.args.get('id')
        url = f'https://api.flowhub.co/v0/locations/{locId}/inventoryByRoomsNonZero'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/room/inventoryAnalyticsWithRoom", methods=["GET"])
def inventoryAnalyticsWithRoom():
    try:
        url = 'https://api.flowhub.co/v0/inventoryAnalyticsByRooms'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/room/invenoryAnalyticsByLocation", methods=["GET"])
def invenoryAnalyticsByLocation():
    try:
        locId = request.args.get('id')
        url = f'https://api.flowhub.co/v0/locations/{locId}/AnalyticsByRooms'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

 #----------------Locations----------------
@app.route("/clientsLocations", methods=["GET"])
def getClientLocation():
    try:
        url = f'https://api.flowhub.co/v0/clientsLocations'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/clientsLocationsById", methods=["GET"])
def getClientLocationById():
    try:
        id = request.args.get('id')
        url = f'https://api.flowhub.co/v0/locations/{id}/clientsLocations'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})
 #----------------Inventory----------------
@app.route("/inventory", methods=["GET"])
def findInventoryByLocation():
    try:
        locId = request.args.get('id')
        url = f'https://api.flowhub.co/v0/locations/{locId}/inventory'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/inventory/findNonZero/", methods=["GET"])
def findInventoryNonZero():
    try:
        locId = request.args.get('id')
        url = f'https://api.flowhub.co/v0/locations/{locId}/inventoryNonZero'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})


@app.route("/inventory/findAllNonZero", methods=["GET"])
def findAllInventoryNonZero():
    try:
        url = 'https://api.flowhub.co/v0/inventoryNonZero'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/inventory/allLocations/", methods=["GET"])
def findInventoryForAllLocations():
    try:
        url = 'https://api.flowhub.co/v0/inventory'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/inventory/Analytics/", methods=["GET"])
def findInventoryAnalytics():
    try:
        url = 'https://api.flowhub.co/v0/inventoryAnalytics'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})

@app.route("/inventory/AnalyticsLocation/", methods=["GET"])
def findInventoryAnalyticsLocation():
    try:
        locId = request.args.get('id')
        url = f'https://api.flowhub.co/v0/locations/{locId}/Analytics'
        print(url)
        response = requests.get(url,headers=headers)
        return response.json()
    except:
        return jsonify({'message': 'Server Error'})


if __name__ == "__main__":
    app.run(debug=True)
