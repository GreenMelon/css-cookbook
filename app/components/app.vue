<style lang="less" scoped>
    @import '../css/main.css';
</style>

<template>
    <div :class="{'side-mode': sideMode}" class="app">
        <aside>
            <ul class="list-module mod-modules">
                <li v-for="module in modules" class="item">
                    <router-link
                        :to="module.route"
                        :class="{active: $route.path == module.route}">{{ module.name }}
                    </router-link>
                </li>
            </ul>
            <i @click="switchFullScreen" class="icon-chevron"></i>
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
                    },{
                        name: 'table',
                        route: '/table'
                    },{
                        name: 'instance',
                        route: '/instance'
                    }
                ],

                sideMode: false
            }
        },
        methods: {
            switchFullScreen() {
                this.sideMode = !this.sideMode;
            }
        },
        created() {
            //
        }
    }
</script>