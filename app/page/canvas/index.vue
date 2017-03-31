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
                        name: 'line',
                        instances: [
                            {
                                name: '001',
                                route: '/canvas/line/1'
                            }
                        ]
                    },{
                        name: 'triangle',
                        instances: [
                            {
                                name: '001',
                                route: '/canvas/triangle/1'
                            }
                        ]
                    },{
                        name: 'rectangle',
                        instances: [
                            {
                                name: '001',
                                route: '/canvas/rectangle/1'
                            }
                        ]
                    },{
                        name: 'circle',
                        instances: [
                            {
                                name: '001',
                                route: '/canvas/circle/1'
                            }
                        ]
                    },{
                        name: 'drawImage',
                        instances: [
                            {
                                name: '001',
                                route: '/canvas/draw-image/001'
                            },{
                                name: '002',
                                route: '/canvas/draw-image/002'
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
