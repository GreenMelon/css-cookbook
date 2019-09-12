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
            baseRoute: '/visual',
            categories: [
                {
                    name: 'border-radius',
                    children: [
                        {
                            route: '01',
                        }, {
                            alias: '无穷',
                            route: 'infinity',
                        }, {
                            alias: '波浪',
                            route: 'wave',
                        },
                    ],
                }, {
                    name: 'outline',
                    children: [
                        {
                            alias: '定义',
                            route: '01',
                        }, {
                            alias: '偏移',
                            route: 'outline-offset',
                        }, {
                            alias: '圆角',
                            route: 'outline-radius',
                        }, {
                            alias: '样式',
                            route: 'outline-style',
                        },
                    ],
                }, {
                    name: 'box-shadow',
                    children: [
                        {
                            route: 'loading.02',
                        }, {
                            alias: '明月几时有',
                            route: 'moon',
                        }, {
                            alias: '多重边框',
                            route: 'multi-border',
                        }, {
                            alias: '是否响应点击事件',
                            route: 'pointer-events',
                        }, {
                            alias: '蒙娜丽莎',
                            route: 'monalisa',
                        }, {
                            alias: '高亮显示',
                            route: 'emphasize',
                        }, {
                            alias: '电灯泡',
                            route: 'bulb',
                        },
                    ],
                }, {
                    name: 'background',
                    children: [
                        {
                            alias: '滚动阴影',
                            route: '01',
                        },
                    ],
                }, {
                    name: 'background-color',
                    children: [
                        {
                            alias: '色卡',
                            route: '01',
                        },
                    ],
                }, {
                    name: 'background-image',
                    children: [
                        {
                            alias: '多重背景图',
                            route: '01',
                        },
                    ],
                }, {
                    name: 'background-position',
                    children: [
                        {
                            alias: '咖啡动画',
                            route: '01',
                        },
                    ],
                }, {
                    name: 'background-repeat',
                    children: [
                        {
                            alias: '定义背景显示区域',
                            route: '01',
                        },
                    ],
                }, {
                    name: 'background-clip',
                    children: [
                        {
                            alias: '定义背景显示区域',
                            route: '01',
                        }, {
                            alias: '透明边框',
                            route: '02',
                        }, {
                            alias: '嵌套的渐变背景',
                            route: '03',
                        }, {
                            alias: '文字背景特效',
                            route: '04',
                        },
                    ],
                }, {
                    name: 'background-size',
                    children: [
                        {
                            alias: '棋盘效果',
                            route: 'chessboard',
                        },
                    ],
                }, {
                    name: 'background-attachment',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'background-blend-mode',
                    children: [
                        {
                            alias: '图片任意赋色技术',
                            route: '01',
                        },
                    ],
                }, {
                    name: 'linear-gradient',
                    alias: '线性渐变',
                    children: [
                        {
                            alias: '渐变边框',
                            route: '01',
                        }, {
                            alias: '地砖',
                            route: '02',
                        }, {
                            route: '03',
                        }, {
                            alias: '渐变动画 01',
                            route: 'animation-01',
                        }, {
                            alias: '渐变动画 02',
                            route: 'animation-02',
                        }, {
                            alias: '渐变圆环',
                            route: 'circle',
                        }, {
                            alias: '图片闪光划过效果',
                            route: 'flash-image-effect',
                        },
                    ],
                }, {
                    name: 'repeating-linear-gradient',
                    alias: '重复线性渐变',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'radial-gradient',
                    alias: '径向渐变',
                    children: [
                        {
                            alias: '谷歌浏览器logo',
                            route: '01',
                        }, {
                            alias: '圆点背景',
                            route: '02',
                        },
                    ],
                }, {
                    name: 'conic-gradient',
                    alias: '圆锥渐变',
                    children: [
                        {
                            alias: '圆锥渐变',
                            route: '01',
                        }, {
                            alias: '棋盘效果',
                            route: 'chessboard',
                        }, {
                            alias: '渐变圆环',
                            route: 'circle',
                        },
                    ],
                }, {
                    name: 'box-reflect',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'cursor',
                    children: [
                        {
                            alias: '自定义鼠标样式',
                            route: '01',
                        },
                    ],
                }, {
                    name: 'filter',
                    alias: '滤镜',
                    children: [
                        {
                            alias: '全部滤镜效果',
                            route: 'all-effects',
                        }, {
                            alias: 'SVG 滤镜',
                            route: 'svg-filter',
                        }, {
                            alias: 'PNG格式小图标的赋色',
                            route: 'drop-shadow',
                        }, {
                            alias: '颜色丰富的阴影',
                            route: 'gradient-shadow',
                        }, {
                            alias: '毛玻璃',
                            route: 'frosted-glass',
                        }, {
                            alias: '透明度',
                            route: 'alpha',
                        }, {
                            alias: '融合动画',
                            route: 'fusion',
                        },
                    ],
                }, {
                    name: 'mask-image',
                    alias: '遮罩',
                    children: [
                        {
                            route: '01',
                        }, {
                            alias: '斜线拼接',
                            route: '02',
                        },
                    ],
                }, {
                    name: 'visibility',
                    alias: '可见性',
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
