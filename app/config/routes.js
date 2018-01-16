/**
 * routes
 */

import NotFound from '../pages/404';
import Index from '../pages/index';

import SelectorIndex from '../pages/selector/index';
import SelectorSelection01 from '../pages/selector/selection/01';
import BrokenImage from '../pages/selector/before/broken-image';
import JiuGong from '../pages/selector/before/jiu-gong';
import Counter1 from '../pages/selector/before/counter-001';
import PointerEvents from '../pages/selector/before/pointer-events';
import BeforeInput from '../pages/selector/before/input';
import BorderCornerShape from '../pages/selector/before/border-corner-shape';
import Empty from '../pages/selector/empty/01';
import FocusWithin from '../pages/selector/focus-within/01';

import FormattingModelIndex from '../pages/formatting-model/index';
import Grid01 from '../pages/formatting-model/grid/01';
import ShapeCircle from '../pages/formatting-model/shape/circle';
import ShapePolygon from '../pages/formatting-model/shape/polygon';
import VerticalAlign from '../pages/formatting-model/align/vertical-align';

import BoxModelIndex from '../pages/box-model/index';
import BorderWidth from '../pages/box-model/border/border-width';
import Clip01 from '../pages/box-model/clip/01';
import GradientCircle03 from '../pages/box-model/clip/circle';
import BackgroundBlendModes from '../pages/box-model/clip/reverse-clip-path-with-blend-modes';

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
import BorderRadius01 from '../pages/visual/border-radius/01';
import Infinity from '../pages/visual/border-radius/infinity';
import Wave from '../pages/visual/border-radius/wave';
import Outline01 from '../pages/visual/outline/01';
import OutlineOffset from '../pages/visual/outline/outline-offset';
import OutlineRadius from '../pages/visual/outline/outline-radius';
import VisualBoxShadowLoading1 from '../pages/visual/box-shadow/loading-001';
import VisualBoxShadowLoading2 from '../pages/visual/box-shadow/loading-002';
import Moon from '../pages/visual/box-shadow/moon';
import MultiBorder from '../pages/visual/box-shadow/multi-border';
import BoxShadowPpointerEvents from '../pages/visual/box-shadow/pointer-events';
import Monalisa from '../pages/visual/box-shadow/monalisa';
import BackgroundImage01 from '../pages/visual/background-image/01';
import TransparentBorder from '../pages/visual/background-clip/transparent-border';
import BackgroundClipText from '../pages/visual/background-clip/text';
import Chessboard01 from '../pages/visual/background-size/chessboard';
import BackgroundBlendMode01 from '../pages/visual/background-blend-mode/01';
import LinearGradient01 from '../pages/visual/linear-gradient/01';
import GradientAnimation from '../pages/visual/linear-gradient/gradient-animation';
import Waveline from '../pages/visual/linear-gradient/waveline';
import GradientCircle02 from '../pages/visual/linear-gradient/circle';
import Chrome from '../pages/visual/radial-gradient/chrome';
import ConicGradient01 from '../pages/visual/conic-gradient/01';
import Chessboard02 from '../pages/visual/conic-gradient/chessboard';
import GradientCircle01 from '../pages/visual/conic-gradient/circle';
import BoxReflect01 from '../pages/visual/box-reflect/01';
import Cursor01 from '../pages/visual/cursor/01';
import AllEffectsFilter from '../pages/visual/filter/all-effects';
import DropShadowFilter from '../pages/visual/filter/drop-shadow';
import GradientShadowFilter from '../pages/visual/filter/gradient-shadow';
import FusionFilter from '../pages/visual/filter/fusion';
import MaskImage01 from '../pages/visual/mask-image/01';
import Visibility01 from '../pages/visual/visibility/01';

import TransformIndex from '../pages/transform/index';
import Parallelogram from '../pages/transform/skew/parallelogram';

import TableIndex from '../pages/table/index';
import TableLayoutIndex from '../pages/table/table-layout/index';

import FormIndex from '../pages/form/index';
import Spellcheck from '../pages/form/spellcheck/01';
import Autocomplete from '../pages/form/autocomplete/01';
import FormCursor from '../pages/form/cursor/01';

import ImageIndex from '../pages/image/index';
import Srcset01 from '../pages/image/srcset/01';
import Sizes01 from '../pages/image/sizes/01';
import Usemap01 from '../pages/image/usemap/01';
import ImageSet01 from '../pages/image/image-set/01';

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

import VideoIndex from '../pages/video/index';
import Mse01 from '../pages/video/mse/01';
import VideoInstances01 from '../pages/video/instances/01';
import VideoInstancesGif from '../pages/video/instances/gif';

import PointerEventsIndex from '../pages/pointerevents/index';
import TouchAction01 from '../pages/pointerevents/touch-action/01';

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
        path: '/selector/focus-within/01',
        component: FocusWithin,
    },{
        path: '/selector/selection/01',
        component: SelectorSelection01
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
        path: '/selector/empty/01',
        component: Empty
    },

    {
        path: '/formatting-model',
        component: FormattingModelIndex
    },{
        path: '/formatting-model/grid/01',
        component: Grid01
    },{
        path: '/formatting-model/shape/circle',
        component: ShapeCircle
    },{
        path: '/formatting-model/shape/polygon',
        component: ShapePolygon
    },{
        path: '/formatting-model/align/vertical-align',
        component: VerticalAlign
    },

    {
        path: '/box-model',
        component: BoxModelIndex
    },{
        path: '/box-model/border/border-width',
        component: BorderWidth
    },{
        path: '/box-model/clip/01',
        component: Clip01
    },{
        path: '/box-model/clip/circle',
        component: GradientCircle03
    },{
        path: '/box-model/clip/reverse-clip-path-with-blend-modes',
        component: BackgroundBlendModes
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
        path: '/visual/border-radius/01',
        component: BorderRadius01
    },{
        path: '/visual/border-radius/infinity',
        component: Infinity
    },{
        path: '/visual/border-radius/wave',
        component: Wave
    },{
        path: '/visual/outline/01',
        component: Outline01
    },{
        path: '/visual/outline/outline-offset',
        component: OutlineOffset
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
        path: '/visual/background-image/01',
        component: BackgroundImage01
    },{
        path: '/visual/background-clip/transparent-border',
        component: TransparentBorder
    },{
        path: '/visual/background-clip/text',
        component: BackgroundClipText
    },{
        path: '/visual/background-size/chessboard',
        component: Chessboard01
    },{
        path: '/visual/background-blend-mode/01',
        component: BackgroundBlendMode01
    },{
        path: '/visual/linear-gradient/01',
        component: LinearGradient01
    },{
        path: '/visual/linear-gradient/gradient-animation',
        component: GradientAnimation
    },{
        path: '/visual/linear-gradient/waveline',
        component: Waveline
    },{
        path: '/visual/linear-gradient/circle',
        component: GradientCircle02
    },{
        path: '/visual/radial-gradient/chrome',
        component: Chrome
    },{
        path: '/visual/conic-gradient/01',
        component: ConicGradient01
    },{
        path: '/visual/conic-gradient/chessboard',
        component: Chessboard02
    },{
        path: '/visual/conic-gradient/circle',
        component: GradientCircle01
    },{
        path: '/visual/box-reflect/01',
        component: BoxReflect01
    },{
        path: '/visual/cursor/01',
        component: Cursor01
    },{
        path: '/visual/filter/all-effects',
        component: AllEffectsFilter
    },{
        path: '/visual/filter/drop-shadow',
        component: DropShadowFilter
    },{
        path: '/visual/filter/gradient-shadow',
        component: GradientShadowFilter
    },{
        path: '/visual/filter/fusion',
        component: FusionFilter
    },{
        path: '/visual/mask-image/01',
        component: MaskImage01
    },{
        path: '/visual/visibility/01',
        component: Visibility01
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
        path: '/image/srcset/01',
        component: Srcset01
    },{
        path: '/image/sizes/01',
        component: Sizes01
    },{
        path: '/image/usemap/01',
        component: Usemap01
    },{
        path: '/image/image-set/01',
        component: ImageSet01
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
        path: '/form./spellcheck/01',
        component: Spellcheck
    },{
        path: '/form./autocomplete/01',
        component: Autocomplete
    },{
        path: '/form./cursor/01',
        component: FormCursor
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
    },

    {
        path: '/video',
        component: VideoIndex
    },{
        path: '/video/mse/01',
        component: Mse01
    },{
        path: '/video/instances/01',
        component: VideoInstances01
    },{
        path: '/video/instances/gif',
        component: VideoInstancesGif
    },

    {
        path: '/pointerevents',
        component: PointerEventsIndex
    },{
        path: '/touch-action/01',
        component: TouchAction01
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
