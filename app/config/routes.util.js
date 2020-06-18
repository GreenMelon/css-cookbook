import createCatalogue from '@/components/catalogue/index.js';

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

const pages = [
    'animation',
    'box-model',
    'element',
    'flex',
    'Form',
    'formatting-model',
    'grid',
    'instances',
    'pointer-events',
    'selector',
    'table',
    'transform',
    'typographic',
    'visual',
];

const pageRoutes = pages.map(i => ({
    path: `/${i}`,
    component: createCatalogue(i),
}));

const routes = [
    {
        path: '/',
        redirect: '/index',
    },

    ...dynamicRoutes,
    ...pageRoutes,

    {
        path: '*',
        component: NotFound,
    },
];

export default routes;
