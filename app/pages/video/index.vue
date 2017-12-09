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
                        name: 'Video',
                        instances: [
                            {
                                name: '简单demo',
                                route: '/video/instances/01'
                            },{
                                name: '用 img 播放 mp4 文件',
                                route: '/video/instances/gif'
                            }
                        ]
                    },{
                        name: 'Media Source Extensions',
                        instances: [
                            {
                                name: '简单demo',
                                route: '/video/mse/01'
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>
