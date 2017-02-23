/**
 * routesborder
 */

import NotFound from './routers/404';
import Index from './routers/index';

import SelectorIndex from './routers/selector/index';
import SelectorSelection1 from './routers/selector/selection/1';
import BrokenImage from './routers/selector/before/broken-image';
import JiuGong from './routers/selector/before/jiu-gong';
import Counter1 from './routers/selector/before/counter-001';
import PointerEvents from './routers/selector/before/pointer-events';
import BeforeInput from './routers/selector/before/input';

import FormattingModelIndex from './routers/formatting-model/index';
import FormattingModelShape1 from './routers/formatting-model/shape/1';
import FormattingModelShape2 from './routers/formatting-model/shape/2';

import BoxModelIndex from './routers/box-model/index';
import BoxModelClip1 from './routers/box-model/clip/reverse-clip-path-with-blend-modes';
import BoxModelBorder1 from './routers/box-model/border/1';

import TypographicIndex from './routers/typographic/index';
import TypographicFontFamily from './routers/typographic/font/font-family';
import TypographicOverflowWrap from './routers/typographic/wrap/overflow-wrap';
import TypographicTextShadow from './routers/typographic/text/text-shadow';
import TextTransform from './routers/typographic/text/text-transform';

import VisualIndex from './routers/visual/index';
import VisualBoxShadowLoading1 from './routers/visual/box-shadow/loading-001';
import VisualBoxShadowLoading2 from './routers/visual/box-shadow/loading-002';
import Moon from './routers/visual/box-shadow/moon';
import MultiBorder from './routers/visual/box-shadow/multi-border';
import VisualBackgroundClip1 from './routers/visual/background-clip/1';
import VisualBackgroundClipText from './routers/visual/background-clip/text';
import LinearGradient1 from './routers/visual/linear-gradient/1';
import DropShadow1 from './routers/visual/drop-shadow/1';
import BoxReflect1 from './routers/visual/box-reflect/1';

import TableIndex from './routers/table/index';
import TableLayoutIndex from './routers/table/table-layout/index';

import FormIndex from './routers/form/index';
import Spellcheck from './routers/form/spellcheck/1';

import InstanceIndex from './routers/instance/index';
import Monalisa from './routers/instance/monalisa';

import DrawIndex from './routers/draw/index';
import DrawBorderRadius1 from './routers/draw/border-radius/1';
import DrawOutline1 from './routers/draw/outline/1';
import DrawRadialGradient1 from './routers/draw/radial-gradient/1';
import DrawClip1 from './routers/draw/clip/1';

import ExercismIndex from './routers/exercism/index';
import ExercismHexagonBorder from './routers/exercism/hexagon/border';
import ExercismHexagonTransform from './routers/exercism/hexagon/transform';
import ExercismHexagonSvg from './routers/exercism/hexagon/svg';
import ExercismHexagonCanvas from './routers/exercism/hexagon/canvas';
import ExercismFlag from './routers/exercism/flag/1';

import ExercismFloatCenterFloat from './routers/exercism/float-center/float';
import ExercismTaiChi1 from './routers/exercism/tai-chi/1';

import TestIndex from './routers/test/index';
import TestscrollTop from './routers/test/scroll-top/1';

import SvgIndex from './routers/svg/index';
import SvgLine1 from './routers/svg/line/1';
import SvgTriangle1 from './routers/svg/triangle/1';
import SvgRectangle1 from './routers/svg/rectangle/1';
import SvgCircle1 from './routers/svg/circle/1';

export default [
    {
        path: '/',
        redirect: '/index'
    }, {
        path: '/index',
        component: Index
    },

    {
        path: '/selector',
        component: SelectorIndex
    },{
        path: '/selector/selection/1',
        component: SelectorSelection1
    },{
        path: '/selector/before/broken-image',
        component: BrokenImage
    },{
        path: '/selector/before/jiu-gong',
        component: JiuGong
    },{
        path: '/selector/before/counter',
        component: Counter1
    },{
        path: '/selector/before/pointer-events',
        component: PointerEvents
    },{
        path: '/selector/before/input',
        component: BeforeInput
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
    },{
        path: '/typographic/text/text-shadow',
        component: TypographicTextShadow
    },{
        path: '/typographic/text/text-transform',
        component: TextTransform
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
        path: '/visual/box-shadow/moon',
        component: Moon
    },{
        path: '/visual/box-shadow/multi-border',
        component: MultiBorder
    },{
        path: '/visual/background-clip/1',
        component: VisualBackgroundClip1
    },{
        path: '/visual/background-clip/text',
        component: VisualBackgroundClipText
    },{
        path: '/visual/linear-gradient/1',
        component: LinearGradient1
    },{
        path: '/visual/drop-shadow/1',
        component: DropShadow1
    },{
        path: '/visual/box-reflect/1',
        component: BoxReflect1
    },

    {
        path: '/table',
        component: TableIndex
    },{
        path: '/table/table-layout',
        component: TableLayoutIndex
    },

    {
        path: '/form',
        component: FormIndex
    },{
        path: '/form/spellcheck/1',
        component: Spellcheck
    },

    {
        path: '/instance',
        component: InstanceIndex
    },{
        path: '/instance/monalisa',
        component: Monalisa
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
    },{
        path: '/exercism/tai-chi/1',
        component: ExercismTaiChi1
    },{
        path: '/exercism/flag/1',
        component: ExercismFlag
    },

    {
        path: '/test',
        component: TestIndex
    },{
        path: '/test/scroll-top',
        component: TestscrollTop
    },

    {
        path: '/svg',
        component: SvgIndex
    },{
        path: '/svg/line/1',
        component: SvgLine1
    },{
        path: '/svg/triangle/1',
        component: SvgTriangle1
    },{
        path: '/svg/rectangle/1',
        component: SvgRectangle1
    },{
        path: '/svg/circle/1',
        component: SvgCircle1
    },

    {
        path: '*',
        component: NotFound
    },


];
