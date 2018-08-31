import { combineReducers } from 'redux';
import app from './appReducer';
import posts from './postReducer';
import editor from './editorReducer';

export default combineReducers({
    app,
    posts,
    editor,
});
