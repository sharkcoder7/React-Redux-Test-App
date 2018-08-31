import { ADD_POST, ADD_POST_COMMENT, FETCH_POST } from '../actions/types';
import _ from 'lodash';

const initialState = {
    data: [],
    page: 1,
    page_count: 1,
    page_size: 10,
    total_items: 0,
};

export default function postReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_POST:
            const nextStateData = [action.payload, ...state.data];
            window.sessionStorage.setItem('cache.posts', JSON.stringify(nextStateData));
            return { ...state, data: nextStateData };

        case FETCH_POST:
            return { ...state, ...action.payload };

        case ADD_POST_COMMENT:
            const comment = action.payload;
            let post = _.find(state.data, { id: comment.wallpost });
            post.comment_count += 1;
            post.comments = {
                ...post.comments,
                [comment.id]: comment,
            };
            return {
                ...state,
                data: [...state.data],
            };
        default:
            return state;
    }
}
