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
                        name: 'rotate',
                        instances: [
                            {
                                name: '饼图',
                                route: '/transform/rotate/pie'
                            }
                        ]
                    },{
                        name: 'rotateX',
                        instances: [
                            {
                                name: '3d-button',
                                route: '/transform/rotateX/3d-button'
                            }
                        ]
                    },{
                        name: 'rotateY',
                        instances: [
                            {
                                name: '旋转扑克',
                                route: '/transform/rotateY/poker'
                            }
                        ]
                    },{
                        name: 'rotateZ',
                        instances: [
                            {
                                name: 'Hamburger Menu',
                                route: '/transform/rotateZ/hamburger-menu'
                            }
                        ]
                    },{
                        name: 'skew',
                        instances: [
                            {
                                name: '平行四边形',
                                route: '/transform/skew/parallelogram'
                            }
                        ]
                    },{
                        name: 'scaleX',
                        instances: [
                            {
                                name: '下划线动画',
                                route: '/transform/scaleX/underline-animation'
                            }
                        ]
                    },{
                        name: 'translate3d',
                        instances: [
                            {
                                name: '小球动画',
                                route: '/transform/translate3d/01'
                            }
                        ]
                    }
                ]
            }
        },
    }
</script>