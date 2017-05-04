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
    export default {
        data() {
            return {
                categories: [
                    {
                        name: 'line',
                        instances: [
                            {
                                name: '001',
                                route: '/svg/line/1'
                            }
                        ]
                    },{
                        name: 'triangle',
                        instances: [
                            {
                                name: '001',
                                route: '/svg/triangle/1'
                            }
                        ]
                    },{
                        name: 'rectangle',
                        instances: [
                            {
                                name: '001',
                                route: '/svg/rectangle/1'
                            }
                        ]
                    },{
                        name: 'circle',
                        instances: [
                            {
                                name: '001',
                                route: '/svg/circle/1'
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
