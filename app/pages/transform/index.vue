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
                        name: 'rotateY',
                        instances: [
                            {
                                name: '旋转扑克',
                                route: '/transform/rotateY/poker'
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
                    }
                ]
            }
        },
    }
</script>