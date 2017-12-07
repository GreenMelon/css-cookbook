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
                        name: 'grid',
                        instances: [
                            {
                                name: '001',
                                route: '/formatting-model/grid/01'
                            }
                        ]
                    },{
                        name: 'shape',
                        instances: [
                            {
                                name: 'shape - circle',
                                route: '/formatting-model/shape/1'
                            },{
                                name: 'shape - polygon',
                                route: '/formatting-model/shape/2'
                            }
                        ]
                    },{
                        name: '对齐',
                        instances: [
                            {
                                name: '垂直对齐',
                                route: '/formatting-model/align/vertical-align'
                            }
                        ]
                    },
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
