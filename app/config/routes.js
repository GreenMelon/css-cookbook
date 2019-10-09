import { types } from 'util';

/**
 * routes
 */

const NotFound = () => import('../pages/404');
const Index = () => import('../pages/index');

const ElementIndex = () => import('../pages/element/index');
const A = () => import('../pages/element/a/01');
const Dialog01 = () => import('../pages/element/dialog/01');
const Dialog02 = () => import('../pages/element/dialog/02');
const Video01 = () => import('../pages/element/video/01');
const VideoGif = () => import('../pages/element/video/gif');
const VideoMse = () => import('../pages/element/video/mse');
const Srcset = () => import('../pages/element/image/srcset');
const Sizes = () => import('../pages/element/image/sizes');
const Usemap = () => import('../pages/element/image/usemap');
const ImageSet = () => import('../pages/element/image/image-set');

const Li = () => import('../pages/element/li/01');
const Progress = () => import('../pages/element/progress/01');

const SelectorIndex = () => import('../pages/selector/index');
const Specificity01 = () => import('../pages/selector/specificity/01');
const AttrSelector01 = () => import('../pages/selector/attr/01');
const SelectionSelector01 = () => import('../pages/selector/selection/01');
const BeforeAttr = () => import('../pages/selector/before/attr');
const Quotes = () => import('../pages/selector/before/quotes');
const BrokenImage = () => import('../pages/selector/before/broken-image');
const JiuGong = () => import('../pages/selector/before/jiu-gong');
const Counter1 = () => import('../pages/selector/before/counter-001');
const PointerEvents = () => import('../pages/selector/before/pointer-events');
const BeforeInput = () => import('../pages/selector/before/input');
const BorderCornerShape = () => import('../pages/selector/before/border-corner-shape');
const ScalableTable = () => import('../pages/selector/before/scalable-table');
const After01 = () => import('../pages/selector/after/01');
const DefaultSelector01 = () => import('../pages/selector/default/01');
const FirstLineSelector = () => import('../pages/selector/first-line/01');
const FirstLetterSelector = () => import('../pages/selector/first-letter/01');
const Empty = () => import('../pages/selector/empty/01');
const FocusWithin = () => import('../pages/selector/focus-within/01');
const FocusVisible = () => import('../pages/selector/focus-visible/01');
const ReadOnly = () => import('../pages/selector/read-only/01');
const ReadWrite = () => import('../pages/selector/read-write/01');
const Password = () => import('../pages/selector/form/password');
const Indeterminate01 = () => import('../pages/selector/indeterminate/01');
const PlaceholderShown01 = () => import('../pages/selector/placeholder-shown/01');
const Matches01 = () => import('../pages/selector/matches/01');
const Blank01 = () => import('../pages/selector/blank/01');
const UserInvalid01 = () => import('../pages/selector/user-invalid/01');

const FormattingModelIndex = () => import('../pages/formatting-model/index');
const ColumnCount = () => import('../pages/formatting-model/column/column-count');
const VerticalAlign = () => import('../pages/formatting-model/align/vertical-align');
const ShapeCircle = () => import('../pages/formatting-model/shape/circle');
const ShapePolygon = () => import('../pages/formatting-model/shape/polygon');

const BoxModelIndex = () => import('../pages/box-model/index');
const BorderWidth01 = () => import('../pages/box-model/border/border-width/01');
const BorderImage01 = () => import('../pages/box-model/border/border-image/01');
const BorderImage02 = () => import('../pages/box-model/border/border-image/02');
const BorderImage03 = () => import('../pages/box-model/border/border-image/03');
const PaddingLeft = () => import('../pages/box-model/padding/left');
const Clip01 = () => import('../pages/box-model/clip/01');
const GradientCircle03 = () => import('../pages/box-model/clip/circle');
const BackgroundBlendModes = () => import('../pages/box-model/clip/reverse-clip-path-with-blend-modes');

const TypographicIndex = () => import('../pages/typographic/index');
const FontFamily = () => import('../pages/typographic/font/font-family');
const FontSmoothing = () => import('../pages/typographic/font/font-smoothing');
const OverflowWrap = () => import('../pages/typographic/wrap/overflow-wrap');
const LineClamp01 = () => import('../pages/typographic/wrap/line-clamp-01');
const LineClamp02 = () => import('../pages/typographic/wrap/line-clamp-02');
const TextAlign = () => import('../pages/typographic/text/text-align');
const TextAlignJustify = () => import('../pages/typographic/text/text-align-justify');
const TextShadow = () => import('../pages/typographic/text/text-shadow');
const TextShadowLlluminate = () => import('../pages/typographic/text/text-shadow-llluminate');
const TextFillColor = () => import('../pages/typographic/text/text-fill-color');
const TextStroke = () => import('../pages/typographic/text/text-stroke');
const TextTransform = () => import('../pages/typographic/text/text-transform');
const WritingMode = () => import('../pages/typographic/text/writing-mode');
const TextDecoration01 = () => import('../pages/typographic/text-decoration/01');
const TextDecoration02 = () => import('../pages/typographic/text-decoration/02');
const TextOutline = () => import('../pages/typographic/text-effect/text-outline');
const ImageText = () => import('../pages/typographic/text-effect/image-text');
const FlashLight = () => import('../pages/typographic/text-effect/flash-light');
const Glitch = () => import('../pages/typographic/text-effect/glitch');
const BlurryText = () => import('../pages/typographic/text-effect/blurry-text');
const TearPaper = () => import('../pages/typographic/text-effect/tear-paper');

const VisualIndex = () => import('../pages/visual/index');
const BorderRadius01 = () => import('../pages/visual/border-radius/01');
const Infinity = () => import('../pages/visual/border-radius/infinity');
const Wave = () => import('../pages/visual/border-radius/wave');
const Outline01 = () => import('../pages/visual/outline/01');
const OutlineOffset = () => import('../pages/visual/outline/outline-offset');
const OutlineRadius = () => import('../pages/visual/outline/outline-radius');
const OutlineStyle = () => import('../pages/visual/outline/outline-style');
const VisualBoxShadowLoading1 = () => import('../pages/visual/box-shadow/loading.01');
const VisualBoxShadowLoading2 = () => import('../pages/visual/box-shadow/loading.02');
const Moon = () => import('../pages/visual/box-shadow/moon');
const MultiBorder = () => import('../pages/visual/box-shadow/multi-border');
const BoxShadowPpointerEvents = () => import('../pages/visual/box-shadow/pointer-events');
const Monalisa = () => import('../pages/visual/box-shadow/monalisa');
const Emphasize = () => import('../pages/visual/box-shadow/emphasize');
const Bulb = () => import('../pages/visual/box-shadow/bulb');
const Background01 = () => import('../pages/visual/background/01');
const BackgroundColor01 = () => import('../pages/visual/background-color/01');
const BackgroundImage01 = () => import('../pages/visual/background-image/01');
const BackgroundPosition01 = () => import('../pages/visual/background-position/01');
const BackgroundClip01 = () => import('../pages/visual/background-clip/01');
const BackgroundClip02 = () => import('../pages/visual/background-clip/02');
const BackgroundClip03 = () => import('../pages/visual/background-clip/03');
const BackgroundClip04 = () => import('../pages/visual/background-clip/04');
const BackgroundRepeat01 = () => import('../pages/visual/background-repeat/01');
const Chessboard01 = () => import('../pages/visual/background-size/chessboard');
const backgroundAttachment01 = () => import('../pages/visual/background-attachment/01');
const MixBlendMode01 = () => import('../pages/visual/mix-blend-mode/01');
const BackgroundBlendMode01 = () => import('../pages/visual/background-blend-mode/01');
const LinearGradient01 = () => import('../pages/visual/linear-gradient/01');
const LinearGradient02 = () => import('../pages/visual/linear-gradient/02');
const LinearGradient03 = () => import('../pages/visual/linear-gradient/03');
const LinearGradientAnimation01 = () => import('../pages/visual/linear-gradient/animation-01');
const LinearGradientAnimation02 = () => import('../pages/visual/linear-gradient/animation-02');
const GradientCircle02 = () => import('../pages/visual/linear-gradient/circle');
const FlashImageEffect = () => import('../pages/visual/linear-gradient/flash-image-effect');
const RepeatingLinearGradient01 = () => import('../pages/visual/repeating-linear-gradient/01');
const RadialGradient01 = () => import('../pages/visual/radial-gradient/01');
const RadialGradient02 = () => import('../pages/visual/radial-gradient/02');
const RadialGradient03 = () => import('../pages/visual/radial-gradient/03');
const ConicGradient01 = () => import('../pages/visual/conic-gradient/01');
const Chessboard02 = () => import('../pages/visual/conic-gradient/chessboard');
const GradientCircle01 = () => import('../pages/visual/conic-gradient/circle');
const BoxReflect01 = () => import('../pages/visual/box-reflect/01');
const Cursor01 = () => import('../pages/visual/cursor/01');
const AllEffectsFilter = () => import('../pages/visual/filter/all-effects');
const SvgFilter = () => import('../pages/visual/filter/svg-filter');
const DropShadowFilter = () => import('../pages/visual/filter/drop-shadow');
const GradientShadowFilter = () => import('../pages/visual/filter/gradient-shadow');
const FrostedGlass = () => import('../pages/visual/filter/frosted-glass');
const Alpha = () => import('../pages/visual/filter/alpha');
const FusionFilter = () => import('../pages/visual/filter/fusion');
const MaskImage01 = () => import('../pages/visual/mask-image/01');
const MaskImage02 = () => import('../pages/visual/mask-image/02');
const Visibility01 = () => import('../pages/visual/visibility/01');

const TransformIndex = () => import('../pages/transform/index');
const Transform3DButton = () => import('../pages/transform/rotateX/3d-button');
const RotateXSwing = () => import('../pages/transform/rotateX/swing');
const RotateY01 = () => import('../pages/transform/rotateY/01');
const RotateY02 = () => import('../pages/transform/rotateY/02');
const HamburgerMenu = () => import('../pages/transform/rotateZ/hamburger-menu');
const Pie = () => import('../pages/transform/rotate/pie');
const Parallelogram = () => import('../pages/transform/skew/parallelogram');
const UnderlineAnimation = () => import('../pages/transform/scaleX/underline-animation');
const Translate3d01 = () => import('../pages/transform/translate3d/01');
const Perspective01 = () => import('../pages/transform/perspective/01');

const AnimationIndex = () => import('../pages/animation/index');
const Loading = () => import('../pages/animation/rotate/loading');
const RotateAnimation = () => import('../pages/animation/rotate/01');

const TableIndex = () => import('../pages/table/index');
const TableLayout01 = () => import('../pages/table/table-layout/01');

const FormIndex = () => import('../pages/form/index');
const Autocomplete = () => import('../pages/form/autocomplete/01');
const CancelButton = () => import('../pages/form/cancel-button/01');
const FormCursor = () => import('../pages/form/cursor/01');
const Checkbox01 = () => import('../pages/form/input/checkbox-01');
const Checkbox02 = () => import('../pages/form/input/checkbox-02');
const Checkbox03 = () => import('../pages/form/input/checkbox-03');
const NumberInput = () => import('../pages/form/input/number');
const FileInput = () => import('../pages/form/input/file');
const Spellcheck = () => import('../pages/form/spellcheck/01');

const PointerEventsIndex = () => import('../pages/pointerevents/index');
const TouchAction01 = () => import('../pages/pointerevents/touch-action/01');
const PointerEvents01 = () => import('../pages/pointerevents/pointer-events/01');

const InstancesIndex = () => import('../pages/instances/index');
const CssDoodle01 = () => import('../pages/instances/css-doodle/01');
const CssDoodle02 = () => import('../pages/instances/css-doodle/02');
const CssDoodle03 = () => import('../pages/instances/css-doodle/03');
const CssDoodle04 = () => import('../pages/instances/css-doodle/04');
const CssDoodle05 = () => import('../pages/instances/css-doodle/05');
const CssDoodle06 = () => import('../pages/instances/css-doodle/06');
const CssDoodle07 = () => import('../pages/instances/css-doodle/07');
const FloatCenter = () => import('../pages/instances/creative/float-center');
const Hexagon = () => import('../pages/instances/creative/hexagon');
const TaiChi = () => import('../pages/instances/creative/tai-chi');
const AnimatedWeatherIcons = () => import('../pages/instances/creative/animated-weather-icons');
const AnimatedBook = () => import('../pages/instances/creative/animated-book');
const HeartBeat = () => import('../pages/instances/creative/heart-beat');
const RibbonAlphabet = () => import('../pages/instances/creative/ribbon/alphabet');
const RibbonName = () => import('../pages/instances/creative/ribbon/name');
const RibbonCard = () => import('../pages/instances/creative/ribbon/card');
const TextAnimation = () => import('../pages/instances/creative/text-animation');
const Loader01 = () => import('../pages/instances/loader/01');
const Loader02 = () => import('../pages/instances/loader/02');
const Loader03 = () => import('../pages/instances/loader/03');
const Color = () => import('../pages/instances/color');
const Accordion = () => import('../pages/instances/accordion');
const SuspendBar = () => import('../pages/instances/suspend-bar');
const LavalampMenu = () => import('../pages/instances/lavalamp-menu');
const Callout = () => import('../pages/instances/callout');
const GetStyle = () => import('../pages/instances/get-style');
const AntLine = () => import('../pages/instances/ant-line');
const Typing01 = () => import('../pages/instances/typing-01');
const Typing02 = () => import('../pages/instances/typing-02');
const Fading = () => import('../pages/instances/fading');
const Search = () => import('../pages/instances/search');
const ShowMore01 = () => import('../pages/instances/show-more/01');
const ShowMore02 = () => import('../pages/instances/show-more/02');
const ShowMore03 = () => import('../pages/instances/show-more/03');

const Grid = () => import('../pages/grid/index');
const Grid01 = () => import('../pages/grid/01');
const Grid02 = () => import('../pages/grid/02');

const Flex = () => import('../pages/flex/index');
const Flex01 = () => import('../pages/flex/01');
const Flex02 = () => import('../pages/flex/02');

export default [
    {
        path: '/',
        redirect: '/index'
    }, {
        path: '/index',
        component: Index
    },

    {
        path: '/element',
        component: ElementIndex
    }, {
        path: '/element/a/01',
        component: A
    }, {
        path: '/element/dialog/01',
        component: Dialog01
    }, {
        path: '/element/dialog/02',
        component: Dialog02
    }, {
        path: '/element/video/01',
        component: Video01
    }, {
        path: '/element/video/gif',
        component: VideoGif
    }, {
        path: '/element/video/mse',
        component: VideoMse
    }, {
        path: '/element/image/srcset',
        component: Srcset
    }, {
        path: '/element/image/sizes',
        component: Sizes
    }, {
        path: '/element/image/usemap',
        component: Usemap
    }, {
        path: '/element/image/image-set',
        component: ImageSet
    }, {
        path: '/element/li/01',
        component: Li
    }, {
        path: '/element/progress/01',
        component: Progress
    },

    {
        path: '/selector',
        component: SelectorIndex
    }, {
        path: '/selector/specificity/01',
        component: Specificity01
    }, {
        path: '/selector/attr/01',
        component: AttrSelector01
    }, {
        path: '/selector/focus-within/01',
        component: FocusWithin,
    }, {
        path: '/selector/focus-visible/01',
        component: FocusVisible,
    }, {
        path: '/selector/read-only/01',
        component: ReadOnly,
    }, {
        path: '/selector/read-write/01',
        component: ReadWrite,
    }, {
        path: '/selector/selection/01',
        component: SelectionSelector01
    }, {
        path: '/selector/before/attr',
        component: BeforeAttr
    }, {
        path: '/selector/before/quotes',
        component: Quotes
    }, {
        path: '/selector/before/broken-image',
        component: BrokenImage
    }, {
        path: '/selector/before/jiu-gong',
        component: JiuGong
    }, {
        path: '/selector/before/counter',
        component: Counter1
    }, {
        path: '/selector/before/pointer-events',
        component: PointerEvents
    }, {
        path: '/selector/before/input',
        component: BeforeInput
    }, {
        path: '/selector/form/password',
        component: Password
    }, {
        path: '/selector/before/border-corner-shape',
        component: BorderCornerShape
    }, {
        path: '/selector/before/scalable-table',
        component: ScalableTable
    }, {
        path: '/selector/after/01',
        component: After01
    }, {
        path: '/selector/default/01',
        component: DefaultSelector01
    }, {
        path: '/selector/first-line/01',
        component: FirstLineSelector
    }, {
        path: '/selector/first-letter/01',
        component: FirstLetterSelector
    }, {
        path: '/selector/empty/01',
        component: Empty
    }, {
        path: '/selector/indeterminate/01',
        component: Indeterminate01
    }, {
        path: '/selector/placeholder-shown/01',
        component: PlaceholderShown01
    }, {
        path: '/selector/matches/01',
        component: Matches01
    }, {
        path: '/selector/blank/01',
        component: Blank01
    }, {
        path: '/selector/user-invalid/01',
        component: UserInvalid01
    },

    {
        path: '/formatting-model',
        component: FormattingModelIndex
    }, {
        path: '/formatting-model/column/column-count',
        component: ColumnCount
    }, {
        path: '/formatting-model/align/vertical-align',
        component: VerticalAlign
    }, {
        path: '/formatting-model/shape/circle',
        component: ShapeCircle
    }, {
        path: '/formatting-model/shape/polygon',
        component: ShapePolygon
    },

    {
        path: '/box-model',
        component: BoxModelIndex
    }, {
        path: '/box-model/border/border-width/01',
        component: BorderWidth01
    }, {
        path: '/box-model/border/border-image/01',
        component: BorderImage01
    }, {
        path: '/box-model/border/border-image/02',
        component: BorderImage02
    }, {
        path: '/box-model/border/border-image/03',
        component: BorderImage03
    }, {
        path: '/box-model/padding/left',
        component: PaddingLeft
    }, {
        path: '/box-model/clip/01',
        component: Clip01
    }, {
        path: '/box-model/clip/circle',
        component: GradientCircle03
    }, {
        path: '/box-model/clip/reverse-clip-path-with-blend-modes',
        component: BackgroundBlendModes
    },

    {
        path: '/typographic',
        component: TypographicIndex
    }, {
        path: '/typographic/font/font-family',
        component: FontFamily
    }, {
        path: '/typographic/font/font-smoothing',
        component: FontSmoothing
    }, {
        path: '/typographic/wrap/overflow-wrap',
        component: OverflowWrap
    }, {
        path: '/typographic/wrap/line-clamp-01',
        component: LineClamp01
    }, {
        path: '/typographic/wrap/line-clamp-02',
        component: LineClamp02
    }, {
        path: '/typographic/text/text-align',
        component: TextAlign
    }, {
        path: '/typographic/text/text-align-justify',
        component: TextAlignJustify
    }, {
        path: '/typographic/text/text-shadow',
        component: TextShadow
    }, {
        path: '/typographic/text/text-shadow-llluminate',
        component: TextShadowLlluminate
    }, {
        path: '/typographic/text/text-fill-color',
        component: TextFillColor
    }, {
        path: '/typographic/text/text-stroke',
        component: TextStroke
    }, {
        path: '/typographic/text/text-transform',
        component: TextTransform
    }, {
        path: '/typographic/text/writing-mode',
        component: WritingMode
    }, {
        path: '/typographic/text-decoration/01',
        component: TextDecoration01
    }, {
        path: '/typographic/text-decoration/02',
        component: TextDecoration02
    }, {
        path: '/typographic/text-effect/text-outline',
        component: TextOutline
    }, {
        path: '/typographic/text-effect/image-text',
        component: ImageText
    }, {
        path: '/typographic/text-effect/flash-light',
        component: FlashLight
    }, {
        path: '/typographic/text-effect/glitch',
        component: Glitch
    }, {
        path: '/typographic/text-effect/blurry-text',
        component: BlurryText
    }, {
        path: '/typographic/text-effect/tear-paper',
        component: TearPaper
    },

    {
        path: '/visual',
        component: VisualIndex
    }, {
        path: '/visual/border-radius/01',
        component: BorderRadius01
    }, {
        path: '/visual/border-radius/infinity',
        component: Infinity
    }, {
        path: '/visual/border-radius/wave',
        component: Wave
    }, {
        path: '/visual/outline/01',
        component: Outline01
    }, {
        path: '/visual/outline/outline-offset',
        component: OutlineOffset
    }, {
        path: '/visual/outline/outline-radius',
        component: OutlineRadius
    }, {
        path: '/visual/outline/outline-style',
        component: OutlineStyle
    }, {
        path: '/visual/box-shadow/loading.01',
        component: VisualBoxShadowLoading1
    }, {
        path: '/visual/box-shadow/loading.02',
        component: VisualBoxShadowLoading2
    }, {
        path: '/visual/box-shadow/moon',
        component: Moon
    }, {
        path: '/visual/box-shadow/multi-border',
        component: MultiBorder
    }, {
        path: '/visual/box-shadow/pointer-events',
        component: BoxShadowPpointerEvents
    }, {
        path: '/visual/box-shadow/monalisa',
        component: Monalisa
    }, {
        path: '/visual/box-shadow/emphasize',
        component: Emphasize
    }, {
        path: '/visual/box-shadow/bulb',
        component: Bulb
    }, {
        path: '/visual/background/01',
        component: Background01
    }, {
        path: '/visual/background-color/01',
        component: BackgroundColor01
    }, {
        path: '/visual/background-image/01',
        component: BackgroundImage01
    }, {
        path: '/visual/background-position/01',
        component: BackgroundPosition01
    }, {
        path: '/visual/background-clip/01',
        component: BackgroundClip01
    }, {
        path: '/visual/background-clip/02',
        component: BackgroundClip02
    }, {
        path: '/visual/background-clip/03',
        component: BackgroundClip03
    }, {
        path: '/visual/background-clip/04',
        component: BackgroundClip04
    }, {
        path: '/visual/background-repeat/01',
        component: BackgroundRepeat01
    }, {
        path: '/visual/background-size/chessboard',
        component: Chessboard01
    }, {
        path: '/visual/background-attachment/01',
        component: backgroundAttachment01
    }, {
        path: '/visual/mix-blend-mode/01',
        component: MixBlendMode01
    }, {
        path: '/visual/background-blend-mode/01',
        component: BackgroundBlendMode01
    }, {
        path: '/visual/linear-gradient/01',
        component: LinearGradient01
    }, {
        path: '/visual/linear-gradient/02',
        component: LinearGradient02
    }, {
        path: '/visual/linear-gradient/03',
        component: LinearGradient03
    }, {
        path: '/visual/linear-gradient/animation-01',
        component: LinearGradientAnimation01
    }, {
        path: '/visual/linear-gradient/animation-02',
        component: LinearGradientAnimation02
    }, {
        path: '/visual/linear-gradient/circle',
        component: GradientCircle02
    }, {
        path: '/visual/linear-gradient/flash-image-effect',
        component: FlashImageEffect
    }, {
        path: '/visual/repeating-linear-gradient/01',
        component: RepeatingLinearGradient01
    }, {
        path: '/visual/radial-gradient/01',
        component: RadialGradient01
    }, {
        path: '/visual/radial-gradient/02',
        component: RadialGradient02
    }, {
        path: '/visual/radial-gradient/03',
        component: RadialGradient03
    }, {
        path: '/visual/conic-gradient/01',
        component: ConicGradient01
    }, {
        path: '/visual/conic-gradient/chessboard',
        component: Chessboard02
    }, {
        path: '/visual/conic-gradient/circle',
        component: GradientCircle01
    }, {
        path: '/visual/box-reflect/01',
        component: BoxReflect01
    }, {
        path: '/visual/cursor/01',
        component: Cursor01
    }, {
        path: '/visual/filter/all-effects',
        component: AllEffectsFilter
    }, {
        path: '/visual/filter/svg-filter',
        component: SvgFilter
    }, {
        path: '/visual/filter/drop-shadow',
        component: DropShadowFilter
    }, {
        path: '/visual/filter/gradient-shadow',
        component: GradientShadowFilter
    }, {
        path: '/visual/filter/frosted-glass',
        component: FrostedGlass
    }, {
        path: '/visual/filter/alpha',
        component: Alpha
    }, {
        path: '/visual/filter/fusion',
        component: FusionFilter
    }, {
        path: '/visual/mask-image/01',
        component: MaskImage01
    }, {
        path: '/visual/mask-image/02',
        component: MaskImage02
    }, {
        path: '/visual/visibility/01',
        component: Visibility01
    },

    {
        path: '/transform',
        component: TransformIndex
    }, {
        path: '/transform/rotate/pie',
        component: Pie
    }, {
        path: '/transform/rotateX/3d-button',
        component: Transform3DButton,
    }, {
        path: '/transform/rotateX/swing',
        component: RotateXSwing,
    }, {
        path: '/transform/rotateY/01',
        component: RotateY01
    }, {
        path: '/transform/rotateY/02',
        component: RotateY02
    }, {
        path: '/transform/rotateZ/hamburger-menu',
        component: HamburgerMenu
    }, {
        path: '/transform/skew/parallelogram',
        component: Parallelogram
    }, {
        path: '/transform/scaleX/underline-animation',
        component: UnderlineAnimation
    }, {
        path: '/transform/translate3d/01',
        component: Translate3d01
    }, {
        path: '/transform/perspective/01',
        component: Perspective01
    },

    {
        path: '/animation',
        component: AnimationIndex
    }, {
        path: '/animation/rotate/loading',
        component: Loading
    }, {
        path: '/animation/rotate/01',
        component: RotateAnimation
    },

    {
        path: '/table',
        component: TableIndex
    }, {
        path: '/table/table-layout/01',
        component: TableLayout01
    },

    {
        path: '/form.',
        component: FormIndex
    }, {
        path: '/form./autocomplete/01',
        component: Autocomplete
    }, {
        path: '/form./cancel-button/01',
        component: CancelButton
    }, {
        path: '/form./cursor/01',
        component: FormCursor
    }, {
        path: '/form./input/checkbox-01',
        component: Checkbox01
    }, {
        path: '/form./input/checkbox-02',
        component: Checkbox02
    }, {
        path: '/form./input/checkbox-03',
        component: Checkbox03
    }, {
        path: '/form./input/number',
        component: NumberInput
    }, {
        path: '/form./input/file',
        component: FileInput
    }, {
        path: '/form./spellcheck/01',
        component: Spellcheck
    },

    {
        path: '/pointerevents',
        component: PointerEventsIndex
    }, {
        path: '/pointerevents/pointer-events/01',
        component: PointerEvents01
    }, {
        path: '/pointerevents/touch-action/01',
        component: TouchAction01
    },

    {
        path: '/instances',
        component: InstancesIndex
    }, {
        path: '/instances/css-doodle/01',
        component: CssDoodle01
    }, {
        path: '/instances/css-doodle/02',
        component: CssDoodle02
    }, {
        path: '/instances/css-doodle/03',
        component: CssDoodle03
    }, {
        path: '/instances/css-doodle/04',
        component: CssDoodle04
    }, {
        path: '/instances/css-doodle/05',
        component: CssDoodle05
    }, {
        path: '/instances/css-doodle/06',
        component: CssDoodle06
    }, {
        path: '/instances/css-doodle/07',
        component: CssDoodle07
    }, {
        path: '/instances/creative/float-center',
        component: FloatCenter
    }, {
        path: '/instances/creative/hexagon',
        component: Hexagon
    }, {
        path: '/instances/creative/tai-chi',
        component: TaiChi
    }, {
        path: '/instances/creative/animated-weather-icons',
        component: AnimatedWeatherIcons
    }, {
        path: '/instances/creative/animated-book',
        component: AnimatedBook
    }, {
        path: '/instances/creative/heart-beat',
        component: HeartBeat
    }, {
        path: '/instances/creative/ribbon/alphabet',
        component: RibbonAlphabet
    }, {
        path: '/instances/creative/ribbon/name',
        component: RibbonName
    }, {
        path: '/instances/creative/ribbon/card',
        component: RibbonCard
    }, {
        path: '/instances/creative/text-animation',
        component: TextAnimation
    }, {
        path: '/instances/loader/01',
        component: Loader01
    }, {
        path: '/instances/loader/02',
        component: Loader02
    }, {
        path: '/instances/loader/03',
        component: Loader03
    }, {
        path: '/instances/show-more/01',
        component: ShowMore01
    }, {
        path: '/instances/show-more/02',
        component: ShowMore02
    }, {
        path: '/instances/show-more/03',
        component: ShowMore03
    }, {
        path: '/instances/color',
        component: Color
    }, {
        path: '/instances/accordion',
        component: Accordion
    }, {
        path: '/instances/suspend-bar',
        component: SuspendBar
    }, {
        path: '/instances/lavalamp-menu',
        component: LavalampMenu
    }, {
        path: '/instances/callout',
        component: Callout
    }, {
        path: '/instances/get-style',
        component: GetStyle
    }, {
        path: '/instances/ant-line',
        component: AntLine
    }, {
        path: '/instances/typing-01',
        component: Typing01
    }, {
        path: '/instances/typing-02',
        component: Typing02
    }, {
        path: '/instances/fading',
        component: Fading
    }, {
        path: '/instances/search',
        component: Search
    },

    {
        path: '/grid',
        component: Grid
    }, {
        path: '/grid/01',
        component: Grid01
    }, {
        path: '/grid/02',
        component: Grid02
    },

    {
        path: '/flex',
        component: Flex
    }, {
        path: '/flex/01',
        component: Flex01
    }, {
        path: '/flex/02',
        component: Flex02
    },

    {
        path: '*',
        component: NotFound
    }

];
