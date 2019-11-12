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
                            alias: '旋转的太极',
                            route: 'tai-chi-animate',
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
                        }, {
                            route: 'no-js-slider',
                        }
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
                        }, {
                            alias: 'infinity-path-loader',
                            route: '03',
                        }
                    ],
                }, {
                    name: 'show-more',
                    alias: '显示更多',
                    children: [
                        {
                            alias: ':checked',
                            route: '01',
                        }, {
                            alias: ':target',
                            route: '02',
                        }, {
                            alias: '-webkit-line-clamp',
                            route: '03',
                        },
                    ],
                }, {
                    name: 'button',
                    alias: '按钮',
                    children: [
                        {
                            alias: '3d 按钮',
                            route: '01',
                        }
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
                }, {
                    alias: '打字效果 01',
                    route: 'typing-01',
                }, {
                    alias: '打字效果 02',
                    route: 'typing-02',
                }, {
                    route: 'fading',
                }, {
                    route: 'search',
                },
            ],
        }
    },
}
</script>
