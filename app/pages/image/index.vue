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
                        name: 'srcset',
                        instances: [
                            {
                                name: '001',
                                route: '/image/srcset/001'
                            }
                        ]
                    },{
                        name: 'sizes',
                        instances: [
                            {
                                name: '001',
                                route: '/image/sizes/001'
                            }
                        ]
                    },{
                        name: 'usemap',
                        instances: [
                            {
                                name: '001',
                                route: '/image/usemap/001'
                            }
                        ]
                    },{
                        name: 'image-set',
                        instances: [
                            {
                                name: '001',
                                route: '/image/image-set/001'
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
