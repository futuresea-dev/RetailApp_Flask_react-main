import { authHeader } from '../_helpers';
import { useConfig } from "../../config";

const config = useConfig()
const serverURL = config.serverUrl

export const userService = {
    login,
    forgotPasswordToConfirmEmail,
    forgotPassword,
    logout,
    register,
    emailVerify,
    getAll,
    getById,
    update,
    updateForAdmin,
    updateMfa,
    updatePassword,
    delete: _delete,

    createLinkForSignup,
    getAllLinks,
    sendLink,
    confirmCodeBeforeSignup,

    getLastPurchasesByDate,
    
    updateDBForAdmin,

    createIP,
};

function login(email, password, confirm) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirm })
    };

    return fetch(`${serverURL}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (user.status) {
                localStorage.setItem('userId', user.data);
                localStorage.setItem('token', user.token);
            }

            return user;
        });
}

function forgotPasswordToConfirmEmail(email) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    };

    return fetch(`${serverURL}/users/forgotPasswordToConfirmEmail`, requestOptions).then(handleResponse);
}

function forgotPassword(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/users/forgotPassword`, requestOptions).then(handleResponse);;
}

function emailVerify(email, verifyCode, password) {
    const requestOptions = {
        method: 'GET'
    };

    return fetch(`${serverURL}/users/verify?email=${email}&verifyCode=${verifyCode}&password=${password}`, requestOptions).then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/users`, requestOptions).then(handleResponse);
}

function getAllLinks() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/links`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/getUser?id=${id}`, requestOptions).then(handleResponse);
}

function sendLink(user) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/links/send`, requestOptions).then(handleResponse);
}

function createIP(ipaddress) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ip_address: ipaddress})
    };

    return fetch(`${serverURL}/createIP`, requestOptions).then(handleResponse);
}

function confirmCodeBeforeSignup(code) {
    const requestOptions = {
        method: 'GET'
    };

    return fetch(`${serverURL}/confirmCodeBeforeSignup?code=${code}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/users/register`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/users/${user.id}`, requestOptions).then(handleResponse);;
}

function updateForAdmin(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/admin/users/${user.id}`, requestOptions).then(handleResponse);;
}

function updateDBForAdmin(tableContent) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(tableContent)
    };

    return fetch(`${serverURL}/admin/updateTable`, requestOptions).then(handleResponse);;
}

function updateMfa(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/updateMfa/${user.id}`, requestOptions).then(handleResponse);;
}

function updatePassword(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/users/updatePassword/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${serverURL}/users/${id}`, requestOptions).then(handleResponse);
}

/*
* LINK Manage
*/
function createLinkForSignup(selectedRole) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedRole)
    };

    return fetch(`${serverURL}/link/create`, requestOptions).then(handleResponse);
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


/*
* Get last purchases by date
*/
function getLastPurchasesByDate(userId) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${serverURL}/lastPurchases/${userId}`, requestOptions).then(handleResponse);
}