<template>
    <main>
        <categories
            :base-route="baseRoute"
            :categories="items"
        />
    </main>
</template>

<script>
export default {
    data() {
        return {
            baseRoute: '/selector',
            items: [
                {
                    name: 'specificity',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'attr',
                    alias: '[attr]',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'selection',
                    alias: '::selection',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'before',
                    alias: '::before',
                    children: [
                        {
                            route: 'attr',
                        }, {
                            route: 'quotes',
                        }, {
                            route: 'broken-image',
                        }, {
                            alias: '九宫格',
                            route: 'jiu-gong',
                        }, {
                            alias: '计数器',
                            route: 'counter',
                        }, {
                            alias: '扩大点击区域',
                            route: 'pointer-events',
                        }, {
                            route: 'input',
                        }, {
                            alias: '内凹圆角',
                            route: 'border-corner-shape',
                        }, {
                            alias: '自适应布局表格',
                            route: 'scalable-table',
                        },
                    ],
                }, {
                    name: 'after',
                    alias: '::after',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'first-line',
                    alias: '::first-line',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'first-letter',
                    alias: '::first-letter',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'empty',
                    alias: ':empty',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'default',
                    alias: ':default',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'focus-within',
                    alias: ':focus-within',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'focus-visible',
                    alias: ':focus-visible',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'read-only',
                    alias: ':read-only',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'read-write',
                    alias: ':read-write',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'form',
                    children: [
                        {
                            alias: '使用属性选择器获取用户密码',
                            route: 'password',
                        },
                    ],
                }, {
                    name: 'indeterminate',
                    children: [
                        {
                            alias: '表单控件状态',
                            route: '01',
                        },
                    ],
                }, {
                    name: 'placeholder-shown',
                    children: [
                        {
                            alias: '显示占位符',
                            route: '01',
                        },
                    ],
                }, {
                    name: 'matches',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'blank',
                    alias: ':blank',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'user-invalid',
                    alias: ':user-invalid',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                },
            ],
        }
    },
}
</script>
