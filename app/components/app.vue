<style lang="less" scoped>
    @import '../css/main.css';
</style>

<template>
    <div class="app">
        <aside>
            <ul class="list-module mod-module">
                <li v-for="module in modules" class="item">
                    <router-link
                        :to="module.route"
                        :class="{active: $route.path == module.route}">{{ module.name }}
                    </router-link>
                </li>
            </ul>
        </aside>
        <router-view></router-view>
    </div>
</template>

<script>
    module.exports = {
        data() {
            return {
                modules: [
                    {
                        name: 'formatting model',
                        route: '/formatting-model'
                    },{
                        name: 'box model',
                        route: '/box-model'
                    },{
                        name: 'typographic',
                        route: '/typographic'
                    },{
                        name: 'visual',
                        route: '/visual'
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