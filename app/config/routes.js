/**
 * routesborder
 */

import NotFound from '../page/404';
import Index from '../page/index';

import SelectorIndex from '../page/selector/index';
import SelectorSelection1 from '../page/selector/selection/1';
import BrokenImage from '../page/selector/before/broken-image';
import JiuGong from '../page/selector/before/jiu-gong';
import Counter1 from '../page/selector/before/counter-001';
import PointerEvents from '../page/selector/before/pointer-events';
import BeforeInput from '../page/selector/before/input';
import BorderCornerShape from '../page/selector/before/border-corner-shape';
import Empty from '../page/selector/empty/001';

import FormattingModelIndex from '../page/formatting-model/index';
import Shape1 from '../page/formatting-model/shape/1';
import Shape2 from '../page/formatting-model/shape/2';
import VerticalAlign from '../page/formatting-model/align/vertical-align';

import BoxModelIndex from '../page/box-model/index';
import BoxModelClip1 from '../page/box-model/clip/reverse-clip-path-with-blend-modes';
import BoxModelBorder1 from '../page/box-model/border/1';

import TypographicIndex from '../page/typographic/index';
import TypographicFontFamily from '../page/typographic/font/font-family';
import TypographicFontSmoothing from '../page/typographic/font/font-smoothing';
import TypographicOverflowWrap from '../page/typographic/wrap/overflow-wrap';
import TypographicTextAlign from '../page/typographic/text/text-align';
import TypographicTextShadow from '../page/typographic/text/text-shadow';
import TextTransform from '../page/typographic/text/text-transform';
import WritingMode from '../page/typographic/text/writing-mode';

import VisualIndex from '../page/visual/index';
import Infinity from '../page/visual/border-radius/infinity';
import Outline1 from '../page/visual/outline/1';
import OutlineOffset1 from '../page/visual/outline/outline-offset';
import OutlineRadius from '../page/visual/outline/outline-radius';
import VisualBoxShadowLoading1 from '../page/visual/box-shadow/loading-001';
import VisualBoxShadowLoading2 from '../page/visual/box-shadow/loading-002';
import Moon from '../page/visual/box-shadow/moon';
import MultiBorder from '../page/visual/box-shadow/multi-border';
import BoxShadowPpointerEvents from '../page/visual/box-shadow/pointer-events';
import Monalisa from '../page/visual/box-shadow/monalisa';
import VisualBackgroundClip1 from '../page/visual/background-clip/1';
import VisualBackgroundClipText from '../page/visual/background-clip/text';
import LinearGradient1 from '../page/visual/linear-gradient/1';
import DropShadow1 from '../page/visual/drop-shadow/1';
import DropShadow2 from '../page/visual/drop-shadow/2';
import BoxReflect1 from '../page/visual/box-reflect/1';
import Cursor from '../page/visual/cursor/001';

import TransformIndex from '../page/transform/index';
import Parallelogram from '../page/transform/skew/parallelogram';

import TableIndex from '../page/table/index';
import TableLayoutIndex from '../page/table/table-layout/index';

import FormIndex from '../page/form/index';
import Spellcheck from '../page/form/spellcheck/1';

import ImageIndex from '../page/image/index';
import Srcset001 from '../page/image/srcset/001';
import Sizes001 from '../page/image/sizes/001';

import DrawIndex from '../page/draw/index';
import DrawBorderRadius1 from '../page/draw/border-radius/1';
import DrawRadialGradient1 from '../page/draw/radial-gradient/1';
import DrawClip1 from '../page/draw/clip/1';

import ExercismIndex from '../page/exercism/index';
import ExercismHexagonBorder from '../page/exercism/hexagon/border';
import ExercismHexagonTransform from '../page/exercism/hexagon/transform';
import ExercismHexagonSvg from '../page/exercism/hexagon/svg';
import ExercismHexagonCanvas from '../page/exercism/hexagon/canvas';
import ExercismFlag from '../page/exercism/flag/1';

import ExercismFloatCenterFloat from '../page/exercism/float-center/float';
import ExercismTaiChi1 from '../page/exercism/tai-chi/1';

import TestIndex from '../page/test/index';
import ScrollTop from '../page/test/scroll-top/1';
import Brace from '../page/test/editor/brace';
import Clipboard001 from '../page/test/clipboard/001';
import FileReaderImgae from '../page/test/filereader/image';

import CanvasIndex from '../page/canvas/index';
import drawImage001 from '../page/canvas/draw-image/001';
import drawImage002 from '../page/canvas/draw-image/002';
import drawImage003 from '../page/canvas/draw-image/003';

import SvgIndex from '../page/svg/index';
import SvgLine1 from '../page/svg/line/1';
import SvgTriangle1 from '../page/svg/triangle/1';
import SvgRectangle1 from '../page/svg/rectangle/1';
import SvgCircle1 from '../page/svg/circle/1';

import PointerEventsIndex from '../page/pointerevents/index';
import TouchAction001 from '../page/pointerevents/touch-action/001';

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
    },{
        path: '/selector/before/border-corner-shape',
        component: BorderCornerShape
    },{
        path: '/selector/empty/001',
        component: Empty
    },

    {
        path: '/formatting-model',
        component: FormattingModelIndex
    },{
        path: '/formatting-model/shape/1',
        component: Shape1
    },{
        path: '/formatting-model/shape/2',
        component: Shape2
    },{
        path: '/formatting-model/align/vertical-align',
        component: VerticalAlign
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
        path: '/typographic/font/font-smoothing',
        component: TypographicFontSmoothing
    },{
        path: '/typographic/wrap/overflow-wrap',
        component: TypographicOverflowWrap
    },{
        path: '/typographic/text/text-align',
        component: TypographicTextAlign
    },{
        path: '/typographic/text/text-shadow',
        component: TypographicTextShadow
    },{
        path: '/typographic/text/text-transform',
        component: TextTransform
    },{
        path: '/typographic/text/writing-mode',
        component: WritingMode
    },

    {
        path: '/visual',
        component: VisualIndex
    },{
        path: '/visual/border-radius/infinity',
        component: Infinity
    },{
        path: '/visual/outline/1',
        component: Outline1
    },{
        path: '/visual/outline/outline-offset',
        component: OutlineOffset1
    },{
        path: '/visual/outline/outline-radius',
        component: OutlineRadius
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
        path: '/visual/box-shadow/pointer-events',
        component: BoxShadowPpointerEvents
    },{
        path: '/visual/box-shadow/monalisa',
        component: Monalisa
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
        path: '/visual/drop-shadow/2',
        component: DropShadow2
    },{
        path: '/visual/box-reflect/1',
        component: BoxReflect1
    },{
        path: '/visual/cursor/001',
        component: Cursor
    },

    {
        path: '/transform',
        component: TransformIndex
    },{
        path: '/transform/skew/parallelogram',
        component: Parallelogram
    },

    {
        path: '/image',
        component: ImageIndex
    },{
        path: '/image/srcset/001',
        component: Srcset001
    },{
        path: '/image/sizes/001',
        component: Sizes001
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
        path: '/draw',
        component: DrawIndex
    },{
        path: '/draw/border-radius/1',
        component: DrawBorderRadius1
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
        component: ScrollTop
    },{
        path: '/test/brace',
        component: Brace
    },{
        path: '/test/clipboard/001',
        component: Clipboard001
    },{
        path: '/test/filereader/image',
        component: FileReaderImgae
    },

    {
        path: '/canvas',
        component: CanvasIndex
    },{
        path: '/canvas/draw-image/001',
        component: drawImage001
    },{
        path: '/canvas/draw-image/002',
        component: drawImage002
    },{
        path: '/canvas/draw-image/003',
        component: drawImage003
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
        path: '/pointerevents',
        component: PointerEventsIndex
    },{
        path: '/touch-action/001',
        component: TouchAction001
    },

    {
        path: '*',
        component: NotFound
    },


];
