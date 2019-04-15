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
                        name: 'a',
                        instances: [
                            {
                                name: '1',
                                route: '/element/a/1'
                            }
                        ]
                    },{
                        name: 'dialog',
                        instances: [
                            {
                                name: '1',
                                route: '/element/dialog/1'
                            }
                        ]
                    },{
                        name: 'video',
                        instances: [
                            {
                                name: '1',
                                route: '/element/video/01'
                            },{
                                name: '用 img 播放 mp4 文件',
                                route: '/element/video/gif'
                            },{
                                name: 'Media Source Extensions',
                                route: '/element/video/mse'
                            }
                        ]
                    },{
                        name: 'image',
                        instances: [
                            {
                                name: 'srcset',
                                route: '/element/image/srcset'
                            },{
                                name: 'sizes',
                                route: '/element/image/sizes'
                            },{
                                name: 'usemap',
                                route: '/element/image/usemap'
                            },{
                                name: 'image-set',
                                route: '/element/image/image-set'
                            }
                        ]
                    },{
                        name: 'li',
                        instances: [
                            {
                                name: '1',
                                route: '/element/li/1'
                            }
                        ]
                    },{
                        name: 'progress',
                        instances: [
                            {
                                name: '1',
                                route: '/element/progress/1'
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>
