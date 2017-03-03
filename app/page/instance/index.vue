<template>
    <main>
        <nav>xxxx</nav>
        <ul class="list-instance">
            <li v-for="instance in instances" class="item-main">
                <router-link :to="instance.route">{{ instance.name }}
                </router-link>
            </li>
        </ul>
    </main>
</template>

<script>
    module.exports = {
        data() {
            return {
                instances: [
                    {
                        name: 'monalisa',
                        route: '/instance/monalisa'
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
