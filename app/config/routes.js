/**
 * routesborder
 */

import NotFound from '../pages/404';
import Index from '../pages/index';

import SelectorIndex from '../pages/selector/index';
import SelectorSelection1 from '../pages/selector/selection/1';
import BrokenImage from '../pages/selector/before/broken-image';
import JiuGong from '../pages/selector/before/jiu-gong';
import Counter1 from '../pages/selector/before/counter-001';
import PointerEvents from '../pages/selector/before/pointer-events';
import BeforeInput from '../pages/selector/before/input';
import BorderCornerShape from '../pages/selector/before/border-corner-shape';
import Empty from '../pages/selector/empty/001';
import FocusWithin from '../pages/selector/focus-within/001';

import FormattingModelIndex from '../pages/formatting-model/index';
import Grid01 from '../pages/formatting-model/grid/01';
import Shape1 from '../pages/formatting-model/shape/1';
import Shape2 from '../pages/formatting-model/shape/2';
import VerticalAlign from '../pages/formatting-model/align/vertical-align';

import BoxModelIndex from '../pages/box-model/index';
import BoxModelClip1 from '../pages/box-model/clip/reverse-clip-path-with-blend-modes';

import TypographicIndex from '../pages/typographic/index';
import FontFamily from '../pages/typographic/font/font-family';
import FontSmoothing from '../pages/typographic/font/font-smoothing';
import OverflowWrap from '../pages/typographic/wrap/overflow-wrap';
import LineClamp from '../pages/typographic/wrap/line-clamp';
import TextAlign from '../pages/typographic/text/text-align';
import TextAlignJustify from '../pages/typographic/text/text-align-justify';
import TextShadow from '../pages/typographic/text/text-shadow';
import TextTransform from '../pages/typographic/text/text-transform';
import WritingMode from '../pages/typographic/text/writing-mode';

import VisualIndex from '../pages/visual/index';
import Infinity from '../pages/visual/border-radius/infinity';
import Outline1 from '../pages/visual/outline/1';
import OutlineOffset1 from '../pages/visual/outline/outline-offset';
import OutlineRadius from '../pages/visual/outline/outline-radius';
import VisualBoxShadowLoading1 from '../pages/visual/box-shadow/loading-001';
import VisualBoxShadowLoading2 from '../pages/visual/box-shadow/loading-002';
import Moon from '../pages/visual/box-shadow/moon';
import MultiBorder from '../pages/visual/box-shadow/multi-border';
import BoxShadowPpointerEvents from '../pages/visual/box-shadow/pointer-events';
import Monalisa from '../pages/visual/box-shadow/monalisa';
import BackgroundImage1 from '../pages/visual/background-image/001';
import VisualBackgroundClip1 from '../pages/visual/background-clip/1';
import VisualBackgroundClipText from '../pages/visual/background-clip/text';
import LinearGradient1 from '../pages/visual/linear-gradient/1';
import GradientAnimation from '../pages/visual/linear-gradient/gradient-animation';
import Waveline from '../pages/visual/linear-gradient/waveline';
import ConicGradient1 from '../pages/visual/conic-gradient/1';
import DropShadow1 from '../pages/visual/drop-shadow/1';
import DropShadow2 from '../pages/visual/drop-shadow/2';
import BoxReflect1 from '../pages/visual/box-reflect/1';
import Cursor from '../pages/visual/cursor/001';
import FilterIndex from '../pages/visual/filter/001';
import FilterGradientShadow from '../pages/visual/filter/gradient-shadow';
import Fusion from '../pages/visual/filter/fusion';

import TransformIndex from '../pages/transform/index';
import Parallelogram from '../pages/transform/skew/parallelogram';

import TableIndex from '../pages/table/index';
import TableLayoutIndex from '../pages/table/table-layout/index';

import FormIndex from '../pages/form/index';
import Spellcheck from '../pages/form/spellcheck/1';
import Autocomplete from '../pages/form/autocomplete/1';
import FormCursor from '../pages/form/cursor/1';

import ImageIndex from '../pages/image/index';
import Srcset001 from '../pages/image/srcset/001';
import Sizes001 from '../pages/image/sizes/001';

import DrawIndex from '../pages/draw/index';
import DrawBorderRadius1 from '../pages/draw/border-radius/1';
import DrawRadialGradient1 from '../pages/draw/radial-gradient/1';
import DrawClip1 from '../pages/draw/clip/1';

import ExercismIndex from '../pages/exercism/index';
import ExercismHexagonBorder from '../pages/exercism/hexagon/border';
import ExercismHexagonTransform from '../pages/exercism/hexagon/transform';
import ExercismHexagonSvg from '../pages/exercism/hexagon/svg';
import ExercismHexagonCanvas from '../pages/exercism/hexagon/canvas';

import ExercismFloatCenterFloat from '../pages/exercism/float-center/float';
import ExercismTaiChi1 from '../pages/exercism/tai-chi/1';

import TestIndex from '../pages/test/index';
import ScrollTop from '../pages/test/scroll-top/1';
import Brace from '../pages/test/editor/brace';
import Clipboard001 from '../pages/test/clipboard/001';
import FileReaderImgae from '../pages/test/filereader/image';
import Sync from '../pages/test/sync/1';

import CanvasIndex from '../pages/canvas/index';
import drawImage001 from '../pages/canvas/draw-image/001';
import drawImage002 from '../pages/canvas/draw-image/002';
import drawImage003 from '../pages/canvas/draw-image/003';

import SvgIndex from '../pages/svg/index';
import SvgLine1 from '../pages/svg/line/1';
import SvgTriangle1 from '../pages/svg/triangle/1';
import SvgRectangle1 from '../pages/svg/rectangle/1';
import SvgCircle1 from '../pages/svg/circle/1';

import VideoIndex from '../pages/video/index';
import Mse001 from '../pages/video/mse/001';
import VideoInstances001 from '../pages/video/instances/001';
import VideoInstancesGif from '../pages/video/instances/gif';

import PointerEventsIndex from '../pages/pointerevents/index';
import TouchAction001 from '../pages/pointerevents/touch-action/001';

import InstancesIndex from '../pages/instances/index';
import Menu001 from '../pages/instances/menu';
import IosBtn from '../pages/instances/ios-btn';

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
        path: '/selector/focus-within/001',
        component: FocusWithin,
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
        path: '/formatting-model/grid/01',
        component: Grid01
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
    },

    {
        path: '/typographic',
        component: TypographicIndex
    },{
        path: '/typographic/font/font-family',
        component: FontFamily
    },{
        path: '/typographic/font/font-smoothing',
        component: FontSmoothing
    },{
        path: '/typographic/wrap/overflow-wrap',
        component: OverflowWrap
    },{
        path: '/typographic/wrap/line-clamp',
        component: LineClamp
    },{
        path: '/typographic/text/text-align',
        component: TextAlign
    },{
        path: '/typographic/text/text-align-justify',
        component: TextAlignJustify
    },{
        path: '/typographic/text/text-shadow',
        component: TextShadow
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
        path: '/visual/background-image/1',
        component: BackgroundImage1
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
        path: '/visual/linear-gradient/gradient-animation',
        component: GradientAnimation
    },{
        path: '/visual/linear-gradient/waveline',
        component: Waveline
    },{
        path: '/visual/conic-gradient/1',
        component: ConicGradient1
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
    },{
        path: '/visual/filter/001',
        component: FilterIndex
    },{
        path: '/visual/filter/gradient-shadow',
        component: FilterGradientShadow
    },{
        path: '/visual/filter/fusion',
        component: Fusion
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
        path: '/form.',
        component: FormIndex
    },{
        path: '/form./spellcheck/1',
        component: Spellcheck
    },{
        path: '/form./autocomplete/1',
        component: Autocomplete
    },{
        path: '/form./cursor/1',
        component: FormCursor
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
    },{
        path: '/test/sync',
        component: Sync
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
        path: '/video',
        component: VideoIndex
    },{
        path: '/video/mse/001',
        component: Mse001
    },{
        path: '/video/instances/001',
        component: VideoInstances001
    },{
        path: '/video/instances/gif',
        component: VideoInstancesGif
    },

    {
        path: '/pointerevents',
        component: PointerEventsIndex
    },{
        path: '/touch-action/001',
        component: TouchAction001
    },

    {
        path: '/instances',
        component: InstancesIndex
    },{
        path: '/instances/menu',
        component: Menu001
    },{
        path: '/instances/ios-btn',
        component: IosBtn
    },

    {
        path: '*',
        component: NotFound
    }

];
