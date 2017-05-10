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
                        name: 'font',
                        instances: [
                            {
                                name: 'font-family',
                                route: '/typographic/font/font-family'
                            },{
                                name: 'overflow-wrap',
                                route: '/typographic/wrap/overflow-wrap'
                            }
                        ]
                    },{
                        name: 'text',
                        instances: [
                            {
                                name: 'text-align',
                                route: '/typographic/text/text-align'
                            },{
                                name: 'text-shadow',
                                route: '/typographic/text/text-shadow'
                            },{
                                name: 'text-transform',
                                route: '/typographic/text/text-transform'
                            },{
                                name: 'writing-mode',
                                route: '/typographic/text/writing-mode'
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
