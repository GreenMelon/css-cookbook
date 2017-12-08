<template>
    <main>
        <categories :categories="categories"></categories>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                categories: [
                    {
                        name: '::selection',
                        instances: [
                            {
                                name: '001',
                                route: '/selector/selection/1'
                            }
                        ]
                    },{
                        name: '::before',
                        instances: [
                            {
                                name: 'broken-image',
                                route: '/selector/before/broken-image'
                            },{
                                name: '九宫格',
                                route: '/selector/before/jiu-gong'
                            },{
                                name: '计数器',
                                route: '/selector/before/counter'
                            },{
                                name: '扩大点击区域',
                                route: '/selector/before/pointer-events'
                            },{
                                name: 'input',
                                route: '/selector/before/input'
                            },{
                                name: '内凹圆角',
                                route: '/selector/before/border-corner-shape'
                            }
                        ]
                    },{
                        name: ':empty',
                        instances: [
                            {
                                name: '001',
                                route: '/selector/empty/001'
                            }
                        ]
                    },{
                        name: ':focus-within',
                        instances: [
                            {
                                name: '001',
                                route: '/selector/focus-within/001'
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
