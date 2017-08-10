<template>
    <main>
        <ul class="list-category mod-categories">
            <li v-for="category in categories" class="item-main">
                <h2 v-text="category.name"></h2>
                <ul class="list-instance">
                    <li v-for="instance in category.instances" class="item-sub">
                        <router-link :to="instance.route">{{ instance.name }}
                        </router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                categories: [
                    {
                        name: 'border-radius',
                        instances: [
                            {
                                name: '无穷',
                                route: '/visual/border-radius/infinity'
                            }
                        ]
                    },{
                        name: 'outline',
                        instances: [
                            {
                                name: '定义',
                                route: '/visual/outline/1'
                            },{
                                name: '偏移',
                                route: '/visual/outline/outline-offset'
                            },{
                                name: '圆角',
                                route: '/visual/outline/outline-radius'
                            }
                        ]
                    },{
                        name: 'box-shadow',
                        instances: [
                            // {
                            //     name: 'loading-001',
                            //     route: '/visual/box-shadow/loading-001'
                            // },
                            {
                                name: 'loading-002',
                                route: '/visual/box-shadow/loading-002'
                            },{
                                name: '明月几时有',
                                route: '/visual/box-shadow/moon'
                            },{
                                name: '多重边框',
                                route: '/visual/box-shadow/multi-border'
                            },{
                                name: '是否响应点击事件',
                                route: '/visual/box-shadow/pointer-events'
                            },{
                                name: '蒙娜丽莎',
                                route: '/visual/box-shadow/monalisa'
                            }
                        ]
                    },{
                        name: 'background-clip',
                        instances: [
                            {
                                name: '透明边框',
                                route: '/visual/background-clip/1'
                            },{
                                name: '文字背景特效',
                                route: '/visual/background-clip/text'
                            }
                        ]
                    },{
                        name: 'linear-gradient 线性渐变',
                        instances: [
                            {
                                name: '渐变边框',
                                route: '/visual/linear-gradient/1'
                            }
                        ]
                    },{
                        name: 'conic-gradient 圆锥渐变',
                        instances: [
                            {
                                name: '圆锥渐变',
                                route: '/visual/conic-gradient/1'
                            }
                        ]
                    },{
                        name: 'drop-shadow',
                        instances: [
                            {
                                name: '001',
                                route: '/visual/drop-shadow/1'
                            },{
                                name: '与 box-shadow 比较',
                                route: '/visual/drop-shadow/2'
                            }
                        ]
                    },{
                        name: 'box-reflect',
                        instances: [
                            {
                                name: '001',
                                route: '/visual/box-reflect/1'
                            }
                        ]
                    },{
                        name: 'cursor',
                        instances: [
                            {
                                name: '自定义鼠标样式',
                                route: '/visual/cursor/001'
                            }
                        ]
                    }
                ]
            }
        },
        methods: {
            //
        },
        created() {
            //
        }
    }
</script>
