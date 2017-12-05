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
                        name: 'test',
                        instances: [
                            {
                                name: 'scrollTop',
                                route: '/test/scroll-top'
                            },{
                                name: 'brace',
                                route: '/test/brace'
                            },{
                                name: 'clipboard',
                                route: '/test/clipboard/001'
                            },{
                                name: 'FileReader',
                                route: '/test/filereader/image'
                            },{
                                name: 'sync',
                                route: '/test/sync'
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
