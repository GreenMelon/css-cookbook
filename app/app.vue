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
                        name: 'animation',
                        route: '/animation'
                    }, {
                        name: 'box model',
                        route: '/box-model'
                    }, {
                        name: 'element',
                        route: '/element'
                    }, {
                        name: 'form',
                        route: '/form.'
                    }, {
                        name: 'formatting model',
                        route: '/formatting-model'
                    }, {
                        name: 'instances',
                        route: '/instances'
                    }, {
                        name: 'pointerevents',
                        route: '/pointerevents'
                    }, {
                        name: 'selector',
                        route: '/selector'
                    }, {
                        name: 'table',
                        route: '/table'
                    }, {
                        name: 'transform',
                        route: '/transform'
                    }, {
                        name: 'typographic',
                        route: '/typographic'
                    }, {
                        name: 'visual',
                        route: '/visual'
                    },
                ]
            }
        },
    }
</script>
