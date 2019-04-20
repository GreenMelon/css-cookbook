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
                        name: 'creative',
                        instances: [
                            {
                                name: '两列排版的文章',
                                route: '/instances/creative/float-center'
                            },{
                                name: '六边形',
                                route: '/instances/creative/hexagon'
                            },{
                                name: '太极',
                                route: '/instances/creative/tai-chi'
                            }
                        ]
                    },{
                        name: 'other',
                        instances: [
                            {
                                name: '手风琴式导航',
                                route: '/instances/other/accordion'
                            },{
                                name: '悬挂条导航',
                                route: '/instances/other/suspend-bar'
                            },{
                                name: '仿IOS按钮',
                                route: '/instances/other/ios-btn'
                            },{
                                name: 'JS 中获取 CSS 值',
                                route: '/instances/other/get-style'
                            }
                        ]
                    }
                ]
            }
        },
    }
</script>
