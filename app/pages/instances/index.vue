<template>
    <main>
        <ul>
            <li
                v-for="(instance, index) in instances"
                :key="index"
            >
                <router-link :to="instance.route">{{ instance.name }}</router-link>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                instances: [
                    {
                        name: '手风琴式导航',
                        route: '/instances/menu'
                    },{
                        name: '仿IOS按钮',
                        route: '/instances/ios-btn'
                    },{
                        name: 'JS 中获取 CSS 值',
                        route: '/instances/get-style'
                    },{
                        name: '文字抖动特效',
                        route: '/instances/glitch'
                    }
                ]
            }
        },
    }
</script>
