<template>
    <main>
        <ul class="list-category mod-categories">
            <li v-for="category in categories" class="item-main">
                <h2 v-text="category.name"></h2>
                <ul class="list-instance">
                    <li v-for="instance in category.instances" class="item-sub">
                        <router-link :to="instance.route">{{ instance.name }}
                        </router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                categories: [
                    {
                        name: 'Video',
                        instances: [
                            {
                                name: '简单demo',
                                route: '/video/instances/001'
                            },{
                                name: '用 img 播放 mp4 文件',
                                route: '/video/instances/gif'
                            }
                        ]
                    },{
                        name: 'Media Source Extensions',
                        instances: [
                            {
                                name: '简单demo',
                                route: '/video/mse/001'
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>
