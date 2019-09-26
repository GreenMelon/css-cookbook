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
            baseRoute: '/instances',
            categories: [
                {
                    name: 'css-doodle',
                    children: [
                        {
                            route: '01'
                        }, {
                            route: '02'
                        }, {
                            route: '03'
                        }, {
                            route: '04'
                        }, {
                            route: '05'
                        }, {
                            route: '06'
                        }, {
                            route: '07'
                        }
                    ],
                }, {
                    name: 'creative',
                    children: [
                        {
                            alias: '两列排版的文章',
                            route: 'float-center',
                        }, {
                            alias: '六边形',
                            route: 'hexagon',
                        }, {
                            alias: '太极',
                            route: 'tai-chi',
                        }, {
                            route: 'animated-weather-icons',
                        }, {
                            route: 'animated-book',
                        }, {
                            route: 'heart-beat',
                        }, {
                            alias: 'ribbon alphabet',
                            route: 'ribbon/alphabet',
                        }, {
                            alias: 'ribbon name',
                            route: 'ribbon/name',
                        }, {
                            alias: 'ribbon card',
                            route: 'ribbon/card',
                        }, {
                            route: 'text-animation',
                        },
                    ],
                }, {
                    name: 'loader',
                    children: [
                        {
                            alias: '圆点渐变色',
                            route: '01',
                        }, {
                            alias: '旋转彩虹',
                            route: '02',
                        },
                    ],
                }, {
                    route: 'color',
                }, {
                    alias: '手风琴式导航',
                    route: 'accordion',
                }, {
                    alias: '悬挂条导航',
                    route: 'suspend-bar',
                }, {
                    route: 'lavalamp-menu',
                }, {
                    alias: '弹出提示框',
                    route: 'callout',
                }, {
                    alias: 'JS 中获取 CSS 值',
                    route: 'get-style',
                }, {
                    alias: '蚂蚁线',
                    route: 'ant-line',
                },
            ],
        }
    },
}
</script>
