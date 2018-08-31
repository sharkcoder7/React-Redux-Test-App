import {
    APP_INITIALIZED,
    LOGIN,
    ADD_POST,
    FETCH_POST,
    ADD_POST_ERROR,
    FETCH_POST_DETAILS,
    ADD_POST_COMMENT,
    ADD_POST_COMMENT_ERROR,
} from './types';
import _ from 'lodash';
import API from '../careerprepped-api';

export const startApiInitialization = () => {
    return async dispatch => {
        API.interceptors.response.use(
            response => response,
            ({ response = { status: 0 } }) => {
                switch (response.status) {
                    case 401:
                    case 403:
                        logoutUser()(dispatch);
                        break;
                    default:
                }
            },
        );

        const userSession = API.getCurrentUser();
        let token;

        if (userSession) {
            dispatch(loginSuccess(userSession));
            token = userSession.access_token;
        }

        dispatch({
            type: APP_INITIALIZED,
            payload: {
                isInitialized: true,
                token,
            },
        });
    };
};

export const loginUser = ({ email, password }) => {
    return dispatch => {
        dispatch({
            type: LOGIN,
            payload: {
                authError: null,
                isLoggingIn: true,
                token: null,
            },
        });
        return API.login(email, password)
            .then(userData => {
                dispatch(loginSuccess(userData));
            })
            .catch(error => {
                const message = _.get(
                    error,
                    'response.data.detail',
                    'Server error: try again later',
                );
                alert(message);
            });
    };
};

export const logoutUser = () => dispatch => {
    API.logout();
    dispatch({
        type: LOGIN,
        payload: {
            authError: null,
            isLoggingIn: false,
            token: null,
        },
    });
};

const loginSuccess = userData => {
    return {
        type: LOGIN,
        payload: {
            authError: null,
            isLoggingIn: false,
            token: userData.access_token,
            currentUser: userData,
        },
    };
};

export const createPost = model => {
    return async dispatch => {
        try {
            const response = await API.post(`discussion/wall`, model);

            dispatch({
                type: ADD_POST,
                payload: response.data,
            });
        } catch (error) {
            if (error.response.status === 422) {
                dispatch({
                    type: ADD_POST_ERROR,
                    payload: error.response.data.validation_messages,
                });
            }
        }
    };
};

export const createPostComment = model => {
    return dispatch => {
        return API.post(`discussion/wall_comment`, model)
            .then(response => {
                dispatch({
                    type: ADD_POST_COMMENT,
                    payload: response.data,
                });
            })
            .catch(error => {
                if (error.response.status === 422) {
                    dispatch({
                        type: ADD_POST_COMMENT_ERROR,
                        payload: error.response.data.validation_messages,
                    });
                }
            });
    };
};

export const fetchAllPosts = (page = 1, type = 'all_activity') => {
    return async (dispatch, getState) => {
        let cachedPosts = [];

        try {
            const cached = window.sessionStorage.getItem('cache.posts');
            if (cached) {
                cachedPosts = JSON.parse(cached);
                dispatch({
                    type: FETCH_POST,
                    payload: {
                        data: cachedPosts,
                    },
                });
            }
        } catch (ignore) {}

        const {
            app: { currentUser = {} },
        } = getState();

        const response = await API.get(`discussion/wall`, {
            params: {
                user: currentUser.user_id,
                page,
                type,
                sort: 'newest',
                comment: 1,
            },
        });
        const payload = {
            ...response.data,
            data: _.get(response, 'data._embedded.wall', []),
        };

        dispatch({
            type: FETCH_POST,
            payload,
        });

        window.sessionStorage.setItem('cache.posts', JSON.stringify(payload.data));
    };
};

export const fetchPostDetails = postId => {
    return dispatch => {
        return API.get(`discussion/wall/${postId}`).then(response => {
            dispatch({
                type: FETCH_POST_DETAILS,
                payload: response.data,
            });
        });
    };
};
