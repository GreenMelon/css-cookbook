/**
 * routes
 */

import NotFound from './routers/404';
import Index from './routers/index';

import FormattingModelIndex from './routers/formatting-model/index';

import BoxModelIndex from './routers/box-model/index';
import BoxModelClip1 from './routers/box-model/clip/reverse-clip-path-with-blend-modes';

import TypographicIndex from './routers/typographic/index';
import TypographicFontFamily from './routers/typographic/font/font-family';
import TypographicOverflowWrap from './routers/typographic/wrap/overflow-wrap';

import VisualIndex from './routers/visual/index';
import VisualBoxShadowLoading1 from './routers/visual/box-shadow/loading-001';
import VisualBoxShadowLoading2 from './routers/visual/box-shadow/loading-002';
import VisualBackgroundClip from './routers/visual/background/background-clip';

import TableIndex from './routers/table/index';
import TableLayoutIndex from './routers/table/table-layout/index';

import InstanceIndex from './routers/instance/index';
import InstanceDrawBorderRadius from './routers/instance/draw/border-radius';
import InstanceDrawOutline from './routers/instance/draw/outline';
import InstanceDrawBoxShadow from './routers/instance/draw/box-shadow';
import InstanceDrawRadialGradient from './routers/instance/draw/radial-gradient';
import InstanceDrawClip from './routers/instance/draw/clip';

import InstanceHexagonBorder from './routers/instance/hexagon/border';
import InstanceHexagonTransform from './routers/instance/hexagon/transform';
import InstanceHexagonSvg from './routers/instance/hexagon/svg';
import InstanceHexagonCanvas from './routers/instance/hexagon/canvas';

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
        path: '/box-model',
        component: BoxModelIndex
    },{
        path: '/box-model/clip/reverse-clip-path-with-blend-modes',
        component: BoxModelClip1
    },

    {
        path: '/typographic',
        component: TypographicIndex
    },{
        path: '/typographic/font/font-family',
        component: TypographicFontFamily
    },{
        path: '/typographic/wrap/overflow-wrap',
        component: TypographicOverflowWrap
    },

    {
        path: '/visual',
        component: VisualIndex
    },{
        path: '/visual/box-shadow/loading-001',
        component: VisualBoxShadowLoading1
    },{
        path: '/visual/box-shadow/loading-002',
        component: VisualBoxShadowLoading2
    },{
        path: '/visual/background/background-clip',
        component: VisualBackgroundClip
    },

    {
        path: '/table',
        component: TableIndex
    },{
        path: '/table/table-layout',
        component: TableLayoutIndex
    },

    {
        path: '/instance',
        component: InstanceIndex
    },{
        path: '/instance/draw/border-radius',
        component: InstanceDrawBorderRadius
    },{
        path: '/instance/draw/outline',
        component: InstanceDrawOutline
    },{
        path: '/instance/draw/box-shadow',
        component: InstanceDrawBoxShadow
    },{
        path: '/instance/draw/radial-gradient',
        component: InstanceDrawRadialGradient
    },{
        path: '/instance/draw/clip',
        component: InstanceDrawClip
    },

    {
        path: '/instance/hexagon/border',
        component: InstanceHexagonBorder
    },{
        path: '/instance/hexagon/transform',
        component: InstanceHexagonTransform
    },{
        path: '/instance/hexagon/svg',
        component: InstanceHexagonSvg
    },{
        path: '/instance/hexagon/canvas',
        component: InstanceHexagonCanvas
    },

    {
        path: '*',
        component: NotFound
    },


];
