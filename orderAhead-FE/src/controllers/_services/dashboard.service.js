import { useConfig } from "../../config";

const config = useConfig()
const serverURL = config.serverUrl

export const dashboardServices = {
  loadDatatableBrand,
  loadDatatableCategory,
  loadDatatableMonth,
  loadDatatableProductType,
  loadDatatableProfile,
  loadDatatableStrain,
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

const callApi = (path) => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  return fetch(`${serverURL}/loadDatatable/${path}`, requestOptions).then(handleResponse);
}

function loadDatatableBrand() {
  return callApi('brand')
}
function loadDatatableCategory() {
  return callApi('category')
}
function loadDatatableMonth() {
  return callApi('month')
}
function loadDatatableProductType() {
  return callApi('productType')
}
function loadDatatableProfile() {
  return callApi('profile')
}
function loadDatatableStrain() {
  return callApi('strain')
}