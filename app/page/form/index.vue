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
                        name: 'spellcheck',
                        instances: [
                            {
                                name: '1',
                                route: '/form/spellcheck/1'
                            }
                        ]
                    },{
                        name: 'autocomplete',
                        instances: [
                            {
                                name: '1',
                                route: '/form/autocomplete/1'
                            }
                        ]
                    },{
                        name: 'cursor',
                        instances: [
                            {
                                name: '1',
                                route: '/form/cursor/1'
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
