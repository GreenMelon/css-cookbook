/**
 * routes
 */

import NotFound from '../pages/404';
import Index from '../pages/index';

import ElementIndex from '../pages/element/index';
import A from '../pages/element/a/1';
import Dialog from '../pages/element/dialog/1';
import Video01 from '../pages/element/video/01';
import VideoGif from '../pages/element/video/gif';
import VideoMse from '../pages/element/video/mse';
import Srcset from '../pages/element/image/srcset';
import Sizes from '../pages/element/image/sizes';
import Usemap from '../pages/element/image/usemap';
import ImageSet from '../pages/element/image/image-set';

import Li from '../pages/element/li/1';
import Progress from '../pages/element/progress/1';

import SelectorIndex from '../pages/selector/index';
import AttrSelector01 from '../pages/selector/attr/01';
import SelectionSelector01 from '../pages/selector/selection/01';
import BeforeAttr from '../pages/selector/before/attr';
import BrokenImage from '../pages/selector/before/broken-image';
import JiuGong from '../pages/selector/before/jiu-gong';
import Counter1 from '../pages/selector/before/counter-001';
import PointerEvents from '../pages/selector/before/pointer-events';
import BeforeInput from '../pages/selector/before/input';
import BorderCornerShape from '../pages/selector/before/border-corner-shape';
import ScalableTable from '../pages/selector/before/scalable-table';
import After01 from '../pages/selector/after/01';
import DefaultSelector01 from '../pages/selector/default/01';
import FirstLineSelector from '../pages/selector/first-line/01';
import FirstLetterSelector from '../pages/selector/first-letter/01';
import Empty from '../pages/selector/empty/01';
import FocusWithin from '../pages/selector/focus-within/01';
import FocusVisible from '../pages/selector/focus-visible/01';
import ReadOnly from '../pages/selector/read-only/01';
import ReadWrite from '../pages/selector/read-write/01';
import Password from '../pages/selector/form/password';
import Indeterminate01 from '../pages/selector/indeterminate/01';
import PlaceholderShown01 from '../pages/selector/placeholder-shown/01';
import Matches01 from '../pages/selector/matches/01';
import Blank01 from '../pages/selector/blank/01';
import UserInvalid01 from '../pages/selector/user-invalid/01';

import FormattingModelIndex from '../pages/formatting-model/index';
import ColumnCount from '../pages/formatting-model/column/column-count';
import VerticalAlign from '../pages/formatting-model/align/vertical-align';
import Flex01 from '../pages/formatting-model/flex/01';
import Grid01 from '../pages/formatting-model/grid/01';
import ShapeCircle from '../pages/formatting-model/shape/circle';
import ShapePolygon from '../pages/formatting-model/shape/polygon';

import BoxModelIndex from '../pages/box-model/index';
import BorderWidth from '../pages/box-model/border/border-width';
import BorderImage from '../pages/box-model/border/border-image';
import PaddingLeft from '../pages/box-model/padding/left';
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
import TextShadowLlluminate from '../pages/typographic/text/text-shadow-llluminate';
import TextFillColor from '../pages/typographic/text/text-fill-color';
import TextStroke from '../pages/typographic/text/text-stroke';
import TextTransform from '../pages/typographic/text/text-transform';
import WritingMode from '../pages/typographic/text/writing-mode';
import TextDecoration from '../pages/typographic/text/text-decoration';
import TextOutline from '../pages/typographic/text-effect/text-outline';
import ImageText from '../pages/typographic/text-effect/image-text';
import FlashLight from '../pages/typographic/text-effect/flash-light';
import Glitch from '../pages/typographic/text-effect/glitch';
import BlurryText from '../pages/typographic/text-effect/blurry-text';

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
import BackgroundColor01 from '../pages/visual/background-color/01';
import BackgroundImage01 from '../pages/visual/background-image/01';
import BackgroundClip01 from '../pages/visual/background-clip/01';
import TransparentBorder from '../pages/visual/background-clip/transparent-border';
import BackgroundClipText from '../pages/visual/background-clip/text';
import Chessboard01 from '../pages/visual/background-size/chessboard';
import BackgroundBlendMode01 from '../pages/visual/background-blend-mode/01';
import LinearGradient01 from '../pages/visual/linear-gradient/01';
import LinearGradient02 from '../pages/visual/linear-gradient/02';
import GradientAnimation from '../pages/visual/linear-gradient/gradient-animation';
import Waveline from '../pages/visual/linear-gradient/waveline';
import GradientCircle02 from '../pages/visual/linear-gradient/circle';
import FlashImageEffect from '../pages/visual/linear-gradient/flash-image-effect';
import Chrome from '../pages/visual/radial-gradient/chrome';
import ConicGradient01 from '../pages/visual/conic-gradient/01';
import Chessboard02 from '../pages/visual/conic-gradient/chessboard';
import GradientCircle01 from '../pages/visual/conic-gradient/circle';
import BoxReflect01 from '../pages/visual/box-reflect/01';
import Cursor01 from '../pages/visual/cursor/01';
import AllEffectsFilter from '../pages/visual/filter/all-effects';
import SvgFilter from '../pages/visual/filter/svg-filter';
import DropShadowFilter from '../pages/visual/filter/drop-shadow';
import GradientShadowFilter from '../pages/visual/filter/gradient-shadow';
import FrostedGlass from '../pages/visual/filter/frosted-glass';
import FusionFilter from '../pages/visual/filter/fusion';
import MaskImage01 from '../pages/visual/mask-image/01';
import MaskImage02 from '../pages/visual/mask-image/02';
import Visibility01 from '../pages/visual/visibility/01';

import TransformIndex from '../pages/transform/index';
import RotatePoker from '../pages/transform/rotateY/poker';
import Pie from '../pages/transform/rotate/pie';
import Parallelogram from '../pages/transform/skew/parallelogram';
import UnderlineAnimation from '../pages/transform/scaleX/underline-animation';

import AnimationIndex from '../pages/animation/index';
import Loading from '../pages/animation/rotate/loading';

import TableIndex from '../pages/table/index';
import TableLayoutIndex from '../pages/table/table-layout/index';

import FormIndex from '../pages/form/index';
import Autocomplete from '../pages/form/autocomplete/01';
import CancelButton from '../pages/form/cancel-button/01';
import FormCursor from '../pages/form/cursor/01';
import Checkbox from '../pages/form/input/checkbox';
import NumberInput from '../pages/form/input/number';
import FileInput from '../pages/form/input/file';
import Spellcheck from '../pages/form/spellcheck/01';

import PointerEventsIndex from '../pages/pointerevents/index';
import TouchAction01 from '../pages/pointerevents/touch-action/01';
import PointerEvents01 from '../pages/pointerevents/pointer-events/01';

import InstancesIndex from '../pages/instances/index';
import FloatCenter from '../pages/instances/creative/float-center';
import Hexagon from '../pages/instances/creative/hexagon';
import TaiChi from '../pages/instances/creative/tai-chi';
import AnimatedWeatherIcons from '../pages/instances/creative/animated-weather-icons';
import Accordion from '../pages/instances/other/accordion';
import SuspendBar from '../pages/instances/other/suspend-bar';
import IosBtn from '../pages/instances/other/ios-btn';
import GetStyle from '../pages/instances/other/get-style';

export default [
    {
        path: '/',
        redirect: '/index'
    },{
        path: '/index',
        component: Index
    },

    {
        path: '/element',
        component: ElementIndex
    },{
        path: '/element/a/1',
        component: A
    },{
        path: '/element/dialog/1',
        component: Dialog
    },{
        path: '/element/video/01',
        component: Video01
    },{
        path: '/element/video/gif',
        component: VideoGif
    },{
        path: '/element/video/mse',
        component: VideoMse
    },{
        path: '/element/image/srcset',
        component: Srcset
    },{
        path: '/element/image/sizes',
        component: Sizes
    },{
        path: '/element/image/usemap',
        component: Usemap
    },{
        path: '/element/image/image-set',
        component: ImageSet
    },{
        path: '/element/li/1',
        component: Li
    },{
        path: '/element/progress/1',
        component: Progress
    },

    {
        path: '/selector',
        component: SelectorIndex
    },{
        path: '/selector/attr/01',
        component: AttrSelector01
    },{
        path: '/selector/focus-within/01',
        component: FocusWithin,
    },{
        path: '/selector/focus-visible/01',
        component: FocusVisible,
    },{
        path: '/selector/read-only/01',
        component: ReadOnly,
    },{
        path: '/selector/read-write/01',
        component: ReadWrite,
    },{
        path: '/selector/selection/01',
        component: SelectionSelector01
    },{
        path: '/selector/before/attr',
        component: BeforeAttr
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
        path: '/selector/form/password',
        component: Password
    },{
        path: '/selector/before/border-corner-shape',
        component: BorderCornerShape
    },{
        path: '/selector/before/scalable-table',
        component: ScalableTable
    },{
        path: '/selector/after/01',
        component: After01
    },{
        path: '/selector/default/01',
        component: DefaultSelector01
    },{
        path: '/selector/first-line/01',
        component: FirstLineSelector
    },{
        path: '/selector/first-letter/01',
        component: FirstLetterSelector
    },{
        path: '/selector/empty/01',
        component: Empty
    },{
        path: '/selector/indeterminate/01',
        component: Indeterminate01
    },{
        path: '/selector/placeholder-shown/01',
        component: PlaceholderShown01
    },{
        path: '/selector/matches/01',
        component: Matches01
    },{
        path: '/selector/blank/01',
        component: Blank01
    },{
        path: '/selector/user-invalid/01',
        component: UserInvalid01
    },

    {
        path: '/formatting-model',
        component: FormattingModelIndex
    },{
        path: '/formatting-model/column/column-count',
        component: ColumnCount
    },{
        path: '/formatting-model/align/vertical-align',
        component: VerticalAlign
    },{
        path: '/formatting-model/flex/01',
        component: Flex01
    },{
        path: '/formatting-model/grid/01',
        component: Grid01
    },{
        path: '/formatting-model/shape/circle',
        component: ShapeCircle
    },{
        path: '/formatting-model/shape/polygon',
        component: ShapePolygon
    },

    {
        path: '/box-model',
        component: BoxModelIndex
    },{
        path: '/box-model/border/border-width',
        component: BorderWidth
    },{
        path: '/box-model/border/border-image',
        component: BorderImage
    },{
        path: '/box-model/padding/left',
        component: PaddingLeft
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
        path: '/typographic/text/text-shadow-llluminate',
        component: TextShadowLlluminate
    },{
        path: '/typographic/text/text-fill-color',
        component: TextFillColor
    },{
        path: '/typographic/text/text-stroke',
        component: TextStroke
    },{
        path: '/typographic/text/text-transform',
        component: TextTransform
    },{
        path: '/typographic/text/writing-mode',
        component: WritingMode
    },{
        path: '/typographic/text/text-decoration',
        component: TextDecoration
    },{
        path: '/typographic/text-effect/text-outline',
        component: TextOutline
    },{
        path: '/typographic/text-effect/image-text',
        component: ImageText
    },{
        path: '/typographic/text-effect/flash-light',
        component: FlashLight
    },{
        path: '/typographic/text-effect/glitch',
        component: Glitch
    },{
        path: '/typographic/text-effect/blurry-text',
        component: BlurryText
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
        path: '/visual/background-color/01',
        component: BackgroundColor01
    },{
        path: '/visual/background-image/01',
        component: BackgroundImage01
    },{
        path: '/visual/background-clip/01',
        component: BackgroundClip01
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
        path: '/visual/linear-gradient/02',
        component: LinearGradient02
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
        path: '/visual/linear-gradient/flash-image-effect',
        component: FlashImageEffect
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
        path: '/visual/filter/svg-filter',
        component: SvgFilter
    },{
        path: '/visual/filter/drop-shadow',
        component: DropShadowFilter
    },{
        path: '/visual/filter/gradient-shadow',
        component: GradientShadowFilter
    },{
        path: '/visual/filter/frosted-glass',
        component: FrostedGlass
    },{
        path: '/visual/filter/fusion',
        component: FusionFilter
    },{
        path: '/visual/mask-image/01',
        component: MaskImage01
    },{
        path: '/visual/mask-image/02',
        component: MaskImage02
    },{
        path: '/visual/visibility/01',
        component: Visibility01
    },

    {
        path: '/transform',
        component: TransformIndex
    },{
        path: '/transform/rotate/pie',
        component: Pie
    },{
        path: '/transform/rotateY/poker',
        component: RotatePoker
    },{
        path: '/transform/skew/parallelogram',
        component: Parallelogram
    },{
        path: '/transform/scaleX/underline-animation',
        component: UnderlineAnimation
    },

    {
        path: '/animation',
        component: AnimationIndex
    },{
        path: '/animation/rotate/loading',
        component: Loading
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
        path: '/form./autocomplete/01',
        component: Autocomplete
    },{
        path: '/form./cancel-button/01',
        component: CancelButton
    },{
        path: '/form./cursor/01',
        component: FormCursor
    },{
        path: '/form./input/checkbox',
        component: Checkbox
    },{
        path: '/form./input/number',
        component: NumberInput
    },{
        path: '/form./input/file',
        component: FileInput
    },{
        path: '/form./spellcheck/01',
        component: Spellcheck
    },

    {
        path: '/pointerevents',
        component: PointerEventsIndex
    },{
        path: '/pointer-events/01',
        component: PointerEvents01
    },{
        path: '/touch-action/01',
        component: TouchAction01
    },

    {
        path: '/instances',
        component: InstancesIndex
    },{
        path: '/instances/creative/float-center',
        component: FloatCenter
    },{
        path: '/instances/creative/hexagon',
        component: Hexagon
    },{
        path: '/instances/creative/tai-chi',
        component: TaiChi
    },{
        path: '/instances/creative/animated-weather-icons',
        component: AnimatedWeatherIcons
    },

    {
        path: '/instances/other/accordion',
        component: Accordion
    },{
        path: '/instances/other/suspend-bar',
        component: SuspendBar
    },{
        path: '/instances/other/ios-btn',
        component: IosBtn
    },{
        path: '/instances/other/get-style',
        component: GetStyle
    },

    {
        path: '*',
        component: NotFound
    }

];
