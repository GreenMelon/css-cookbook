<template>
    <main>
        <categories
            :base-route="baseRoute"
            :categories="categories"
        />
    </main>
</template>

<script>
export default {
    data() {
        return {
            baseRoute: '/transform',
            categories: [
                {
                    name: 'rotate',
                    children: [
                        {
                            alias: '饼图',
                            route: 'pie',
                        },
                    ],
                }, {
                    name: 'rotateX',
                    children: [
                        {
                            route: '3d-button',
                        }, {
                            route: 'swing',
                        },
                    ],
                }, {
                    name: 'rotateY',
                    children: [
                        {
                            alias: '旋转扑克',
                            route: '01',
                        }, {
                            route: '02',
                        },
                    ],
                }, {
                    name: 'rotateZ',
                    children: [
                        {
                            route: 'hamburger-menu',
                        },
                    ],
                }, {
                    name: 'skew',
                    children: [
                        {
                            alias: '平行四边形',
                            route: 'parallelogram',
                        },
                    ],
                }, {
                    name: 'scaleX',
                    children: [
                        {
                            alias: '下划线动画',
                            route: 'underline-animation',
                        },
                    ],
                }, {
                    name: 'translate3d',
                    children: [
                        {
                            alias: '小球动画',
                            route: '01',
                        },
                    ],
                },
            ],
        }
    },
}
</script>