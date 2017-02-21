<style lang="less" scoped>
    @import '../css/main.css';
</style>

<template>
    <div class="app">
        <aside>
            <ul class="list-module mod-modules">
                <li v-for="module in modules" class="item">
                    <router-link
                        :to="module.route"
                        :class="{active: $route.path.startsWith(module.route)}">{{ module.name }}
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
                        name: 'selector',
                        route: '/selector'
                    },{
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
                    },{
                        name: 'table',
                        route: '/table'
                    },{
                        name: 'form',
                        route: '/form'
                    },{
                        name: 'instance',
                        route: '/instance'
                    },{
                        name: 'draw',
                        route: '/draw'
                    },{
                        name: 'exercism',
                        route: '/exercism'
                    },{
                        name: 'test',
                        route: '/test'
                    },{
                        name: 'svg',
                        route: '/svg'
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