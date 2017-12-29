<template>
    <main>
        <ul>
            <li v-for="instance in instances">
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
                    }
                ]
            }
        },
    }
</script>
