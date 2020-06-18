import createCatalogue from '@/components/catalogue/index.js';

const NotFound = () => import('../pages/404');

const files = require.context('../pages', true, /\.vue$/);

const dynamicRoutes = files.keys().map(key => {
    const component = files(key);
    const path = key.replace(/(\.\/|\.vue)/g, '').replace('/index', '');
    const route = {
        path: `/${path}`,
        component,
    };
    return route;
});

const pageRoutes = dynamicRoutes
    .map(i => i.path)
    .map(i => i.split('/'))
    .filter(i => i.length > 2)
    .reduce((all, i) => {
        if (!all.includes(i[1])) {
            all.push(i[1]);
        }
        return all;
    }, [])
    .map(i => ({
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
