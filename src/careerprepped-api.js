import axios from 'axios';

const OAUTH_ENDPOINT = 'https://devapi.careerprepped.com/oauth';
const OAUTH_CLIENT_ID = 'careerprepped';
const OAUTH_GRANT_TYPE = 'password';
const apiUrl = 'https://devapi.careerprepped.com/';

const CURRENT_USER_KEY = 'user';
const TOKEN_KEY = 'access_token';
const TOKEN_TYPE_KEY = 'token_type';

const API = axios.create({
    baseURL: apiUrl,
    headers: { Accept: 'application/json;charset=utf-8' },
    timeout: 10000,
});

API.interceptors.request.use(
    function(config) {
        const access_token = window.sessionStorage.getItem(TOKEN_KEY);
        const token_type = window.sessionStorage.getItem(TOKEN_TYPE_KEY);
        config.headers.Authorization = `${token_type} ${access_token}`;
        return config;
    },
    function(error) {
        return Promise.reject(error);
    },
);

API.getCurrentUser = () => {
    try {
        const asString = window.sessionStorage.getItem(CURRENT_USER_KEY);
        return JSON.parse(asString);
    } catch (ignore) {
        /* no user data */
    }

    return null;
};
API.login = async (email, password) => {
    const { data } = await axios.post(OAUTH_ENDPOINT, {
        grant_type: OAUTH_GRANT_TYPE,
        client_id: OAUTH_CLIENT_ID,
        email,
        password,
    });

    window.sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data));
    window.sessionStorage.setItem(TOKEN_KEY, data.access_token);
    window.sessionStorage.setItem(TOKEN_TYPE_KEY, data.token_type);

    return data;
};
API.logout = () => {
    window.sessionStorage.removeItem(CURRENT_USER_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_TYPE_KEY);
};

export default API;
