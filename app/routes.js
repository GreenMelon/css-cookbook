/**
 * routesborder
 */

import NotFound from './routers/404';
import Index from './routers/index';

import FormattingModelIndex from './routers/formatting-model/index';
import FormattingModelShape1 from './routers/formatting-model/shape/1';
import FormattingModelShape2 from './routers/formatting-model/shape/2';

import BoxModelIndex from './routers/box-model/index';
import BoxModelClip1 from './routers/box-model/clip/reverse-clip-path-with-blend-modes';
import BoxModelBorder1 from './routers/box-model/border/1';

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

import DrawIndex from './routers/draw/index';
import DrawBorderRadius1 from './routers/draw/border-radius/1';
import DrawOutline1 from './routers/draw/outline/1';
import DrawBoxShadow1 from './routers/draw/box-shadow/1';
import DrawRadialGradient1 from './routers/draw/radial-gradient/1';
import DrawClip1 from './routers/draw/clip/1';

import ExercismIndex from './routers/exercism/index';
import ExercismHexagonBorder from './routers/exercism/hexagon/border';
import ExercismHexagonTransform from './routers/exercism/hexagon/transform';
import ExercismHexagonSvg from './routers/exercism/hexagon/svg';
import ExercismHexagonCanvas from './routers/exercism/hexagon/canvas';

import ExercismFloatCenterFloat from './routers/exercism/float-center/float';

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
    },{
        path: '/formatting-model/shape/1',
        component: FormattingModelShape1
    },{
        path: '/formatting-model/shape/2',
        component: FormattingModelShape2
    },

    {
        path: '/box-model',
        component: BoxModelIndex
    },{
        path: '/box-model/clip/reverse-clip-path-with-blend-modes',
        component: BoxModelClip1
    },{
        path: '/box-model/border/1',
        component: BoxModelBorder1
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
    },

    {
        path: '/draw',
        component: DrawIndex
    },{
        path: '/draw/border-radius/1',
        component: DrawBorderRadius1
    },{
        path: '/draw/outline/1',
        component: DrawOutline1
    },{
        path: '/draw/box-shadow/1',
        component: DrawBoxShadow1
    },{
        path: '/draw/radial-gradient/1',
        component: DrawRadialGradient1
    },{
        path: '/draw/clip/1',
        component: DrawClip1
    },

    {
        path: '/exercism',
        component: ExercismIndex
    },{
        path: '/exercism/hexagon/border',
        component: ExercismHexagonBorder
    },{
        path: '/exercism/hexagon/transform',
        component: ExercismHexagonTransform
    },{
        path: '/exercism/hexagon/svg',
        component: ExercismHexagonSvg
    },{
        path: '/exercism/hexagon/canvas',
        component: ExercismHexagonCanvas
    },{
        path: '/exercism/float-center/float',
        component: ExercismFloatCenterFloat
    },

    {
        path: '*',
        component: NotFound
    },


];
