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
                            {
                                name: 'loading-001',
                                route: '/visual/box-shadow/loading-001'
                            },{
                                name: 'loading-002',
                                route: '/visual/box-shadow/loading-002'
                            }
                        ]
                    },{
                        name: 'background',
                        instances: [
                            {
                                name: 'background-clip',
                                route: '/visual/background/background-clip'
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
