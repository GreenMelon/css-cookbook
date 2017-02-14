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
                        name: 'clip',
                        instances: [
                            {
                                name: 'reverse clip-path with blend-modes',
                                route: '/box-model/clip/reverse-clip-path-with-blend-modes'
                            }
                        ]
                    },{
                        name: 'border',
                        instances: [
                            {
                                name: '透明边框',
                                route: '/visual/background-clip/1'
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
