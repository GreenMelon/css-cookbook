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
                        name: 'css-doodle',
                        instances: [
                            {
                                name: '01',
                                route: '/instances/css-doodle/01'
                            },{
                                name: '02',
                                route: '/instances/css-doodle/02'
                            },{
                                name: '03',
                                route: '/instances/css-doodle/03'
                            },{
                                name: '04',
                                route: '/instances/css-doodle/04'
                            },{
                                name: '05',
                                route: '/instances/css-doodle/05'
                            },{
                                name: '06',
                                route: '/instances/css-doodle/06'
                            },{
                                name: '07',
                                route: '/instances/css-doodle/07'
                            }
                        ]
                    },{
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
                            },{
                                name: 'animated-weather-icons',
                                route: '/instances/creative/animated-weather-icons'
                            },{
                                name: 'animated-book',
                                route: '/instances/creative/animated-book'
                            },{
                                name: 'heart-beat',
                                route: '/instances/creative/heart-beat'
                            },{
                                name: 'ribbon alphabet',
                                route: '/instances/creative/ribbon/alphabet'
                            },{
                                name: 'ribbon name',
                                route: '/instances/creative/ribbon/name'
                            },{
                                name: 'ribbon card',
                                route: '/instances/creative/ribbon/card'
                            }
                        ]
                    },{
                        name: 'loader',
                        instances: [
                            {
                                name: '圆点渐变色',
                                route: '/instances/loader/01'
                            },{
                                name: '旋转彩虹',
                                route: '/instances/loader/02'
                            }
                        ]
                    },{
                        name: 'other',
                        instances: [
                            {
                                name: 'color',
                                route: '/instances/other/color'
                            },{
                                name: '手风琴式导航',
                                route: '/instances/other/accordion'
                            },{
                                name: '悬挂条导航',
                                route: '/instances/other/suspend-bar'
                            },{
                                name: 'lavalamp-menu',
                                route: '/instances/other/lavalamp-menu'
                            },{
                                name: '弹出提示框',
                                route: '/instances/other/callout'
                            },{
                                name: '仿IOS按钮',
                                route: '/instances/other/ios-btn'
                            },{
                                name: 'JS 中获取 CSS 值',
                                route: '/instances/other/get-style'
                            },{
                                name: '蚂蚁线',
                                route: '/instances/other/ant-line'
                            }
                        ]
                    }
                ]
            }
        },
    }
</script>
