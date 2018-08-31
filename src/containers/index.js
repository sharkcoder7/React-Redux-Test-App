import Login from './Login/Login';
import PostList from './PostList/PostList';
import EditPost from './EditPost/EditPost';

export default [
    { path: '/login', name: 'Login', component: Login },
    { path: '/post/:postId', name: 'EditPost', component: EditPost, isPrivate: false, exact: true },
    { path: '/', name: 'Home', component: PostList, isPrivate: true },
];
