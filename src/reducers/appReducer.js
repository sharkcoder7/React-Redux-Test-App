import { APP_INITIALIZED, LOGIN } from '../actions/types';

const initialState = {
    isInitialized: false,
    apiError: null,
    authError: null,
    isLoggingIn: false,
    token: null,
    currentUser: null,
};

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case APP_INITIALIZED:
        case LOGIN:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
