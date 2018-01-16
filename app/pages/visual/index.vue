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
                            }
                        ]
                    },{
                        name: 'box-shadow',
                        instances: [
                            // {
                            //     name: 'loading-001',
                            //     route: '/visual/box-shadow/loading-001'
                            // },
                            {
                                name: 'loading-002',
                                route: '/visual/box-shadow/loading-002'
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
                            }
                        ]
                    },{
                        name: 'background-image',
                        instances: [
                            {
                                name: '多重背景图',
                                route: '/visual/background-image/01'
                            }
                        ]
                    },{
                        name: 'background-clip',
                        instances: [
                            {
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
                                name: '渐变动画',
                                route: '/visual/linear-gradient/gradient-animation'
                            },{
                                name: '波浪线',
                                route: '/visual/linear-gradient/waveline'
                            },{
                                name: '渐变圆环',
                                route: '/visual/linear-gradient/circle'
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
                                route: '/visual/filter/01'
                            },{
                                name: 'PNG格式小图标的赋色',
                                route: '/visual/filter/drop-shadow'
                            },{
                                name: '颜色丰富的阴影',
                                route: '/visual/filter/gradient-shadow'
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
