import { ADD_POST, ADD_POST_ERROR, FETCH_POST_DETAILS } from '../actions/types';

const initialState = {
    model: {},
    isUploading: false,
    error: null,
};

export default function postReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_POST:
            return { ...initialState };
        case ADD_POST_ERROR:
            return { ...state, error: action.payload };
        case FETCH_POST_DETAILS:
            return { ...state, model: action.payload };
        default:
            return state;
    }
}
