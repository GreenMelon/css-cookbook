/**
 * routes
 */

import NotFound from './routers/404';
import Index from './routers/index';

import FormattingModelIndex from './routers/formatting-model/index';

import InstanceIndex from './routers/instance/index';
import InstanceDrawBorderRadius from './routers/instance/draw/border-radius';
import InstanceDrawRadialGradient from './routers/instance/draw/radial-gradient';

export default [
    {
        path: '/',
        redirect: '/index'
    }, {
        path: '/index',
        component: Index
    },

    {
        path: '/formatting-model',
        component: FormattingModelIndex
    },

    {
        path: '/instance',
        component: InstanceIndex
    },{
        path: '/instance/draw/border-radius',
        component: InstanceDrawBorderRadius
    },{
        path: '/instance/draw/radial-gradient',
        component: InstanceDrawRadialGradient
    },

    {
        path: '*',
        component: NotFound
    },


];
