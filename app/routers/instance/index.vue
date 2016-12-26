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
                        name: 'draw',
                        instances: [
                            {
                                name: 'border-radius',
                                route: '/instance/draw/border-radius'
                            },{
                                name: 'outline',
                                route: '/instance/draw/outline'
                            },{
                                name: 'box-shadow',
                                route: '/instance/draw/box-shadow'
                            },{
                                name: 'radial-gradient',
                                route: '/instance/draw/radial-gradient'
                            },{
                                name: 'clip',
                                route: '/instance/draw/clip'
                            }
                        ]
                    },{
                        name: 'hexagon',
                        instances: [
                            {
                                name: 'border',
                                route: '/instance/hexagon/border'
                            },{
                                name: 'transform',
                                route: '/instance/hexagon/transform'
                            },{
                                name: 'svg',
                                route: '/instance/hexagon/svg'
                            },{
                                name: 'canvas',
                                route: '/instance/hexagon/canvas'
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
