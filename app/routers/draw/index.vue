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
                        name: 'border-radius',
                        instances: [
                            {
                                name: '1',
                                route: '/draw/border-radius/1'
                            }
                        ]
                    },{
                        name: 'box-shadow',
                        instances: [
                            {
                                name: '1',
                                route: '/draw/box-shadow/1'
                            }
                        ]
                    },{
                        name: 'clip',
                        instances: [
                            {
                                name: '1',
                                route: '/draw/clip/1'
                            }
                        ]
                    },{
                        name: 'outline',
                        instances: [
                            {
                                name: '1',
                                route: '/draw/outline/1'
                            }
                        ]
                    },{
                        name: 'radial-gradient',
                        instances: [
                            {
                                name: '1',
                                route: '/draw/radial-gradient/1'
                            }
                        ]
                    },{
                        name: 'padding',
                        instances: [
                            {
                                name: '1',
                                route: '/draw/padding/1'
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
