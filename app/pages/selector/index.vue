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
                        name: '[attr]',
                        instances: [
                            {
                                name: '01',
                                route: '/selector/attr/01'
                            }
                        ]
                    },{
                        name: '::selection',
                        instances: [
                            {
                                name: '01',
                                route: '/selector/selection/01'
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
                        name: '::first-line',
                        instances: [
                            {
                                name: '01',
                                route: '/selector/first-line/01'
                            }
                        ]
                    },{
                        name: '::first-letter',
                        instances: [
                            {
                                name: '01',
                                route: '/selector/first-letter/01'
                            }
                        ]
                    },{
                        name: ':empty',
                        instances: [
                            {
                                name: '01',
                                route: '/selector/empty/01'
                            }
                        ]
                    },{
                        name: ':default',
                        instances: [
                            {
                                name: '01',
                                route: '/selector/default/01'
                            }
                        ]
                    },{
                        name: ':focus-within',
                        instances: [
                            {
                                name: '01',
                                route: '/selector/focus-within/01'
                            }
                        ]
                    },{
                        name: ':focus-visible',
                        instances: [
                            {
                                name: '01',
                                route: '/selector/focus-visible/01'
                            }
                        ]
                    },{
                        name: 'form',
                        instances: [
                            {
                                name: '使用属性选择器获取用户密码',
                                route: '/selector/form/password'
                            }
                        ]
                    }
                ]
            }
        },
    }
</script>
