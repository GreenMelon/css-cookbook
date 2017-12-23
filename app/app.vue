<style lang="less">
    @import './less/main.less';
</style>

<template>
    <div id="app">
        <modules :modules="modules"></modules>
        <router-view></router-view>
    </div>
</template>

<script>
    import './components/modules';
    import './components/categories';

    export default {
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
                        route: '/form.'
                    },{
                        name: 'image',
                        route: '/image'
                    },{
                        name: 'pointerevents',
                        route: '/pointerevents'
                    },{
                        name: 'svg',
                        route: '/svg'
                    },{
                        name: 'canvas',
                        route: '/canvas'
                    },{
                        name: 'video',
                        route: '/video'
                    },{
                        name: 'exercism',
                        route: '/exercism'
                    },{
                        name: 'test',
                        route: '/test'
                    },{
                        name: 'instances',
                        route: '/instances'
                    }
                ]
            }
        },
        methods: {},
        mounted() {
            this.$nextTick(function () {
                // this.$el;
            });
        },
    }
</script>
