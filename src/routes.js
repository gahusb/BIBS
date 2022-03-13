import { ListPage, PostPage, EditorPage } from 'pages';

export default [
    {
        path: '/',
        exact: true,
        component: ListPage
    },
    {
        path: '/post/:id',
        component: PostPage
    },
    {
        path: '/page/:page',
        component: ListPage
    },
    {
        path: '/page/:userId/:page?',
        component: ListPage
    },
    {
        path: '/editor',
        component: EditorPage
    }
];
