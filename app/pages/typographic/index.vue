<template>
    <main>
        <categories
            :base-route="baseRoute"
            :categories="items"
        />
    </main>
</template>

<script>
export default {
    data() {
        return {
            baseRoute: '/typographic',
            items: [
                {
                    name: 'font',
                    children: [
                        {
                            route: 'font-family',
                        }, {
                            route: 'font-smoothing',
                        },
                    ],
                }, {
                    name: 'text',
                    children: [
                        {
                            route: 'text-align',
                        }, {
                            route: 'text-align-justify',
                        }, {
                            route: 'text-shadow',
                        }, {
                            alias: '发光文字',
                            route: 'text-shadow-llluminate'
                        }, {
                            route: 'text-fill-color',
                        }, {
                            route: 'text-stroke',
                        }, {
                            route: 'text-transform',
                        }, {
                            route: 'writing-mode',
                        },
                    ],
                }, {
                    name: 'text-decoration',
                    children: [
                        {
                            route: '01',
                        }, {
                            route: '02',
                        },
                    ],
                }, {
                    name: 'text-effect',
                    children: [
                        {
                            route: 'text-outline',
                        }, {
                            route: 'image-text',
                        }, {
                            route: 'flash-light',
                        }, {
                            alias: '文字抖动特效',
                            route: 'glitch',
                        }, {
                            alias: '模糊文本',
                            route: 'blurry-text',
                        },
                    ],
                }, {
                    name: 'wrap',
                    children: [
                        {
                            route: 'overflow-wrap',
                        }, {
                            route: 'line-clamp-01',
                        }, {
                            route: 'line-clamp-02',
                        },
                    ],
                }
            ]
        }
    },
}
</script>
