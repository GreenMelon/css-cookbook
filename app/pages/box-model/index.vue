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
                        name: 'border',
                        instances: [
                            {
                                name: 'border-width',
                                instances: [
                                    {
                                        name: '边框宽度可继承',
                                        route: '/box-model/border/border-width/01'
                                    }
                                ]
                            },{
                                name: 'border-image',
                                instances: [
                                    {
                                        name: '01',
                                        route: '/box-model/border/border-image/01'
                                    },{
                                        name: '02',
                                        route: '/box-model/border/border-image/02'
                                    }
                                ],
                            },{
                                name: 'border-color',
                                instances: [
                                    {
                                        name: '透明边框',
                                        route: '/visual/background-clip/transparent-border'
                                    }
                                ],
                            }
                        ]
                    },{
                        name: 'padding',
                        instances: [
                            {
                                name: 'padding-left 百分比',
                                route: '/box-model/padding/left'
                            }
                        ]
                    },{
                        name: 'clip',
                        instances: [
                            {
                                name: '背景裁切',
                                route: '/box-model/clip/01'
                            },{
                                name: '渐变圆环',
                                route: '/box-model/clip/circle'
                            },{
                                name: 'reverse clip-path with blend-modes',
                                route: '/box-model/clip/reverse-clip-path-with-blend-modes'
                            }
                        ]
                    },
                ]
            }
        }
    }
</script>
