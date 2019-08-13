<template>
    <main>
        <categories :categories="categories"></categories>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                categories: [
                    {
                        name: 'border-radius',
                        instances: [
                            {
                                name: '01',
                                route: '/visual/border-radius/01'
                            },{
                                name: '无穷',
                                route: '/visual/border-radius/infinity'
                            },{
                                name: '波浪',
                                route: '/visual/border-radius/wave'
                            }
                        ]
                    },{
                        name: 'outline',
                        instances: [
                            {
                                name: '定义',
                                route: '/visual/outline/01'
                            },{
                                name: '偏移',
                                route: '/visual/outline/outline-offset'
                            },{
                                name: '圆角',
                                route: '/visual/outline/outline-radius'
                            },{
                                name: '样式',
                                route: '/visual/outline/outline-style'
                            }
                        ]
                    },{
                        name: 'box-shadow',
                        instances: [
                            // {
                            //     name: 'loading.01',
                            //     route: '/visual/box-shadow/loading.01'
                            // },
                            {
                                name: 'loading.02',
                                route: '/visual/box-shadow/loading.02'
                            },{
                                name: '明月几时有',
                                route: '/visual/box-shadow/moon'
                            },{
                                name: '多重边框',
                                route: '/visual/box-shadow/multi-border'
                            },{
                                name: '是否响应点击事件',
                                route: '/visual/box-shadow/pointer-events'
                            },{
                                name: '蒙娜丽莎',
                                route: '/visual/box-shadow/monalisa'
                            },{
                                name: '高亮显示',
                                route: '/visual/box-shadow/emphasize'
                            },{
                                name: '电灯泡',
                                route: '/visual/box-shadow/bulb'
                            }
                        ]
                    },{
                        name: 'background',
                        instances: [
                            {
                                name: '滚动阴影',
                                route: '/visual/background/01'
                            }
                        ],
                    },{
                        name: 'background-color',
                        instances: [
                            {
                                name: '色卡',
                                route: '/visual/background-color/01'
                            }
                        ],
                    },{
                        name: 'background-image',
                        instances: [
                            {
                                name: '多重背景图',
                                route: '/visual/background-image/01'
                            }
                        ]
                    },{
                        name: 'background-repeat',
                        instances: [
                            {
                                name: '定义背景显示区域',
                                route: '/visual/background-repeat/01'
                            }
                        ]
                    },{
                        name: 'background-clip',
                        instances: [
                            {
                                name: '定义背景显示区域',
                                route: '/visual/background-clip/01'
                            },{
                                name: '透明边框',
                                route: '/visual/background-clip/transparent-border'
                            },{
                                name: '文字背景特效',
                                route: '/visual/background-clip/text'
                            }
                        ]
                    },{
                        name: 'background-size',
                        instances: [
                            {
                                name: '棋盘效果',
                                route: '/visual/background-size/chessboard'
                            }
                        ]
                    },{
                        name: 'background-attachment',
                        instances: [
                            {
                                name: '01',
                                route: '/visual/background-attachment/01'
                            }
                        ]
                    },{
                        name: 'background-blend-mode',
                        instances: [
                            {
                                name: '图片任意赋色技术',
                                route: '/visual/background-blend-mode/01'
                            }
                        ]
                    },{
                        name: 'linear-gradient 线性渐变',
                        instances: [
                            {
                                name: '渐变边框',
                                route: '/visual/linear-gradient/01'
                            },{
                                name: '地砖',
                                route: '/visual/linear-gradient/02'
                            },{
                                name: '渐变动画',
                                route: '/visual/linear-gradient/gradient-animation'
                            },{
                                name: '波浪线',
                                route: '/visual/linear-gradient/waveline'
                            },{
                                name: '渐变圆环',
                                route: '/visual/linear-gradient/circle'
                            },{
                                name: '图片闪光划过效果',
                                route: '/visual/linear-gradient/flash-image-effect'
                            }
                        ]
                    },{
                        name: 'radial-gradient 径向渐变',
                        instances: [
                            {
                                name: '谷歌浏览器logo',
                                route: '/visual/radial-gradient/chrome'
                            },
                        ]
                    },{
                        name: 'conic-gradient 圆锥渐变',
                        instances: [
                            {
                                name: '圆锥渐变',
                                route: '/visual/conic-gradient/01'
                            },{
                                name: '棋盘效果',
                                route: '/visual/conic-gradient/chessboard'
                            },{
                                name: '渐变圆环',
                                route: '/visual/conic-gradient/circle'
                            }
                        ]
                    },{
                        name: 'box-reflect',
                        instances: [
                            {
                                name: '001',
                                route: '/visual/box-reflect/01'
                            }
                        ]
                    },{
                        name: 'cursor',
                        instances: [
                            {
                                name: '自定义鼠标样式',
                                route: '/visual/cursor/01'
                            }
                        ]
                    },{
                        name: 'filter 滤镜',
                        instances: [
                            {
                                name: '全部滤镜效果',
                                route: '/visual/filter/all-effects'
                            },{
                                name: 'SVG 滤镜',
                                route: '/visual/filter/svg-filter'
                            },{
                                name: 'PNG格式小图标的赋色',
                                route: '/visual/filter/drop-shadow'
                            },{
                                name: '颜色丰富的阴影',
                                route: '/visual/filter/gradient-shadow'
                            },{
                                name: '毛玻璃',
                                route: '/visual/filter/frosted-glass'
                            },{
                                name: '透明度',
                                route: '/visual/filter/alpha'
                            },{
                                name: '融合动画',
                                route: '/visual/filter/fusion'
                            }
                        ]
                    },{
                        name: 'mask-image 遮罩',
                        instances: [
                            {
                                name: '01',
                                route: '/visual/mask-image/01'
                            },{
                                name: '斜线拼接',
                                route: '/visual/mask-image/02'
                            }
                        ]
                    },{
                        name: 'visibility 可见性',
                        instances: [
                            {
                                name: '01',
                                route: '/visual/visibility/01'
                            }
                        ]
                    }
                ]
            }
        },
    }
</script>
