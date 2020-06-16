const NotFound = () => import('../pages/404');

const pages = {};
const files = require.context('../pages', true, /\.vue$/);

files.keys().forEach(key => {
    const file = files(key);
    const path = key.replace(/(\.\/|\.vue)/g, '');
    pages[path] = file;
});

const dynamicRoutes = Object.keys(pages).map(path => {
    const p = path.replace('/index', '');
    const route = {
        path: `/${p}`,
        component: pages[path],
    };
    return route;
});

const routes = [
    {
        path: '/',
        redirect: '/index',
    },

    ...dynamicRoutes,

    {
        path: '*',
        component: NotFound,
    }
];

export default routes;
