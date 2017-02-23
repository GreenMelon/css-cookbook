<template>
    <main>
        <nav>xxxx</nav>
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
    module.exports = {
        data() {
            return {
                categories: [
                    {
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
                        name: 'linear-gradient',
                        instances: [
                            {
                                name: '渐变边框',
                                route: '/visual/linear-gradient/1'
                            }
                        ]
                    },{
                        name: 'drop-shadow',
                        instances: [
                            {
                                name: '001',
                                route: '/visual/drop-shadow/1'
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
