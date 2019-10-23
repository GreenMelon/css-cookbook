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
            baseRoute: '/element',
            categories: [
                {
                    name: 'a',
                    children: [
                        {
                            route: '01',
                        }, {
                            alias: 'footer notes',
                            route: '02',
                        },
                    ]
                }, {
                    name: 'dialog',
                    children: [
                        {
                            route: '01'
                        }, {
                            route: '02'
                        },
                    ]
                }, {
                    name: 'video',
                    children: [
                        {
                            route: '01',
                        }, {
                            alias: '用 img 播放 mp4 文件',
                            route: 'gif',
                        }, {
                            alias: 'Media Source Extensions',
                            route: 'mse',
                        },
                    ],
                }, {
                    name: 'image',
                    children: [
                        {
                            route: 'srcset',
                        }, {
                            route: 'sizes',
                        }, {
                            route: 'usemap',
                        }, {
                            route: 'image-set',
                        },
                    ],
                }, {
                    name: 'li',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'progress',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }
            ]
        }
    },
}
</script>
