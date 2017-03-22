<style lang="less">
    @import './less/main.less';
</style>

<template>
    <div id="app">
        <aside>
            <ul class="mod-modules list-module">
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
                        name: 'transform',
                        route: '/transform'
                    },{
                        name: 'table',
                        route: '/table'
                    },{
                        name: 'form',
                        route: '/form'
                    },{
                        name: 'image',
                        route: '/image'
                    },{
                        name: 'svg',
                        route: '/svg'
                    },{
                        name: 'canvas',
                        route: '/canvas'
                    },{
                        name: 'draw',
                        route: '/draw'
                    },{
                        name: 'exercism',
                        route: '/exercism'
                    },{
                        name: 'test',
                        route: '/test'
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