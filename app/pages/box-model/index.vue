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
            baseRoute: '/box-model',
            items: [
                {
                    name: 'border',
                    children: [
                        {
                            name: 'border-width',
                            children: [
                                {
                                    alias: '边框宽度可继承',
                                    route: '01',
                                },
                            ],
                        }, {
                            name: 'border-image',
                            children: [
                                {
                                    route: '01',
                                }, {
                                    route: '02',
                                },
                            ],
                        }
                    ]
                }, {
                    name: 'padding',
                    children: [
                        {
                            alias: 'padding-left 百分比',
                            route: 'left',
                        },
                    ],
                }, {
                    name: 'clip',
                    children: [
                        {
                            alias: '背景裁切',
                            route: '01',
                        }, {
                            alias: '渐变圆环',
                            route: 'circle',
                        }, {
                            route: 'reverse-clip-path-with-blend-modes',
                        },
                    ],
                },
            ],
        }
    },
}
</script>
