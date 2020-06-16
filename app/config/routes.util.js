const NotFound = () => import('../pages/404');

const files = require.context('../pages', true, /\.vue$/);

const dynamicRoutes = files.keys().map(key => {
    const file = files(key);
    const path = key.replace(/(\.\/|\.vue)/g, '').replace('/index', '');
    const route = {
        path: `/${path}`,
        component: file,
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

console.log(1, routes);

export default routes;
