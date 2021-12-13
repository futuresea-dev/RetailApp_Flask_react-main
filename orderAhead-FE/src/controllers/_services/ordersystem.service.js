import { useConfig } from "../../config";
import axios from 'axios';

const config = useConfig()
const serverURL = config.serverUrl

export const osServices = {
  osLoadCategories,
  osLoadBrands,
  osLoadProducts,
  osLoadTypes,
  osLoadProduct,
  osLoadType,
  osUpdateType,
  osGetBoughtProductReviews,
  osLoadReview,
  osUpdateReview,
  osLoadProductTypesByCategory,
  osLoadShippingZone,
  osLoadShippingZones,
  osUpdateShippingZone,
  osGetShippingMethods,
  osRecalculatePrice,
  osDeleteMedia,
  osUploadMediaFiles,
  osLoadProductGallery,
  osPlaceOrder,
  osUpdateProduct,
  osShippingZoneAddMethod,
  osShippingZoneSaveChanges,
  osShippingZoneDelete,
  osShippingZoneUpdateMethodStatus,
  osShippingZoneInstanceDelete,
  osLoadMethodInstance,
  osUpdateMethodInstace,
};

function handleResponse(response) {
  return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
          if (response.status === 401) {
              // auto logout if 401 response returned from api
              // logout();
          }

          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
      }

      return data;
  });
}

const callApi = (path, params) => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  if (params) {
    requestOptions.method = 'POST'
    requestOptions.body = JSON.stringify(params)
  }

  return fetch(`${serverURL}/${path}`, requestOptions).then(handleResponse);
}



function osLoadCategories() {
  return callApi('ordersystem/loadCategories')
}

function osLoadBrands(params) {
  return callApi('ordersystem/loadBrands', params)
}
function osLoadTypes(params) {
  return callApi('ordersystem/loadTypes', params)
}

function osLoadProducts(params) {
  return callApi('ordersystem/loadProducts', params)
}

function osLoadProduct(params) {
  return callApi('ordersystem/loadProduct', params)
}

function osLoadType(params) {
  return callApi('ordersystem/osLoadType', params)
}

function osUpdateType(formData) {
  const path = 'ordersystem/osUpdateType'
  return axios.post(`${serverURL}/${path}`, formData)
}

function osGetBoughtProductReviews(params) {
  return callApi('ordersystem/osGetBoughtProductReviews', params)
}

function osLoadReview(params) {
  return callApi('ordersystem/osLoadReview', params)
}

function osUpdateReview(formData) {
  const path = 'ordersystem/osUpdateReview'
  return axios.post(`${serverURL}/${path}`, formData)
}

function osLoadProductTypesByCategory(params) {
  return callApi('ordersystem/osLoadProductTypesByCategory', params)
}

function osGetShippingMethods(params) {
  return callApi('ordersystem/osGetShippingMethods', params)
}

function osRecalculatePrice() {
  return callApi('ordersystem/osRecalculatePrice', {})
}

function osDeleteMedia(params) {
  return callApi('ordersystem/osDeleteMedia', params)
}

function osUploadMediaFiles(formData) {
  const path = 'ordersystem/osUploadMediaFiles'
  return axios.post(`${serverURL}/${path}`, formData)
}

function osLoadProductGallery(params) {
  return callApi('ordersystem/osLoadProductGallery', params)
}

function osPlaceOrder(params) {
  return callApi('ordersystem/osPlaceOrder', params)
}

function osUpdateProduct(formData) {
  const path = 'ordersystem/osUpdateProduct'
  return axios.post(`${serverURL}/${path}`, formData)
}

function osShippingZoneAddMethod(formData) {
  const path = 'ordersystem/osShippingZoneAddMethod'
  return axios.post(`${serverURL}/${path}`, formData)
}

function osShippingZoneMethodsSaveSettings(formData) {
  const path = 'ordersystem/osShippingZoneMethodsSaveSettings'
  return axios.post(`${serverURL}/${path}`, formData)
}

function osShippingZoneSaveChanges(formData) {
  const path = 'ordersystem/osShippingZoneSaveChanges'
  return axios.post(`${serverURL}/${path}`, formData)
}

function osLoadShippingZone(params) {
  return callApi('ordersystem/osLoadShippingZone', params)
}

function osLoadShippingZones(params) {
  return callApi('ordersystem/osLoadShippingZones', params)
}

function osUpdateShippingZone(params) {
  return callApi('ordersystem/osUpdateShippingZone', params)
}

function osShippingZoneDelete(params) {
  return callApi('ordersystem/osShippingZoneDelete', params)
}
function osShippingZoneUpdateMethodStatus(params) {
  return callApi('ordersystem/osShippingZoneUpdateMethodStatus', params)
}
function osShippingZoneInstanceDelete(params) {
  return callApi('ordersystem/osShippingZoneInstanceDelete', params)
}

function osLoadMethodInstance(params) {
  return callApi('ordersystem/osLoadMethodInstance', params)
}

function osUpdateMethodInstace(params) {
  return callApi('ordersystem/osUpdateMethodInstace', params)
}
