/**
 * routes
 */

import NotFound from './routers/404';
import Index from './routers/index';

export default [
    {
        path: '/',
        redirect: '/index'
    }, {
        path: '/index',
        component: Index
    },

    {
        path: '*',
        component: NotFound
    }
];
