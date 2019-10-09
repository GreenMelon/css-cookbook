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
                            name: '用 img 播放 mp4 文件',
                            route: 'gif',
                        }, {
                            name: 'Media Source Extensions',
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
