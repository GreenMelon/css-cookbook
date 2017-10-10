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
                        name: 'font',
                        instances: [
                            {
                                name: 'font-family',
                                route: '/typographic/font/font-family'
                            },{
                                name: 'font-smoothing',
                                route: '/typographic/font/font-smoothing'
                            }
                        ]
                    },{
                        name: 'text',
                        instances: [
                            {
                                name: 'text-align',
                                route: '/typographic/text/text-align'
                            },{
                                name: 'text-align-justify',
                                route: '/typographic/text/text-align-justify'
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
                    },{
                        name: 'wrap',
                        instances: [
                            {
                                name: 'overflow-wrap',
                                route: '/typographic/wrap/overflow-wrap'
                            },{
                                name: 'line-clamp',
                                route: '/typographic/wrap/line-clamp'
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
