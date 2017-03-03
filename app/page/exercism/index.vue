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
                        name: 'hexagon',
                        instances: [
                            {
                                name: 'border',
                                route: '/exercism/hexagon/border'
                            },{
                                name: 'transform',
                                route: '/exercism/hexagon/transform'
                            },{
                                name: 'svg',
                                route: '/exercism/hexagon/svg'
                            },{
                                name: 'canvas',
                                route: '/exercism/hexagon/canvas'
                            }
                        ]
                    },{
                        name: 'float-center',
                        instances: [
                            {
                                name: 'float',
                                route: '/exercism/float-center/float'
                            },{
                                name: 'shape',
                                route: '/exercism/float-center/shape'
                            }
                        ]
                    },{
                        name: 'tai-chi',
                        instances: [
                            {
                                name: '1',
                                route: '/exercism/tai-chi/1'
                            }
                        ]
                    },{
                        name: 'flag',
                        instances: [
                            {
                                name: '摸底小测试',
                                route: '/exercism/flag/1'
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
