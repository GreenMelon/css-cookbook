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
                            }
                        ]
                    },{
                        name: 'drop-shadow',
                        instances: [
                            {
                                name: '001',
                                route: '/visual/drop-shadow/01'
                            },{
                                name: '与 box-shadow 比较',
                                route: '/visual/drop-shadow/02'
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
                    }
                ]
            }
        },
    }
</script>
