import { authHeader } from '../_helpers';
import { useConfig } from "../../config";

const config = useConfig()
const serverURL = config.serverUrl

export const dbManageService = {
    getTableNames,
    getDataInfoByTableName,
    fileUpload,
    downloadCSV,
    deleteIPAddress,
};

/*
* Get table names
*/
function getTableNames() {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`${serverURL}/getTableList`, requestOptions).then(handleResponse);
}

function getDataInfoByTableName(tableName) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"name": tableName})
    };

    return fetch(`${serverURL}/getDataInfoByTableName`, requestOptions).then(handleResponse);
}

function downloadCSV(tableName) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"name": tableName}),
        responseType: 'blob'
    };

    return fetch(`${serverURL}/downloadCSV`, requestOptions).then(handleResponse);
}

function fileUpload(file) {
    const formData = new FormData();
    formData.append('csv', file);

    const requestOptions = {
        method: 'POST',
        // headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
        headers: {  },
        body: formData
    };

    return fetch(`${serverURL}/uploadFile`, requestOptions).then(handleResponse);
}

function deleteIPAddress(ip_address) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"data": ip_address})
    };

    return fetch(`${serverURL}/deleteIPAddress`, requestOptions).then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}