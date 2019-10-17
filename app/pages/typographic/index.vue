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
            baseRoute: '/typographic',
            categories: [
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
                            alias: 'pseudo underlines',
                            route: '01',
                        }, {
                            alias: '可配置项',
                            route: '02',
                        },
                    ],
                }, {
                    name: 'text-shadow',
                    children: [
                        {
                            route: '01',
                        }, {
                            alias: '发光文字',
                            route: '02',
                        }, {
                            route: '03',
                        }
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
                        }, {
                            alias: '撕纸效果',
                            route: 'tear-paper',
                        }
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
