<template>
    <main>
        <categories
            :base-route="baseRoute"
            :categories="categories"
        />
    </main>
</template>

<script>
export default {
    data() {
        return {
            baseRoute: '/flex',
            categories: [
                {
                    alias: '总览',
                    route: '01',
                }, {
                    alias: 'order',
                    route: '02',
                }
            ]
        }
    },
}
</script>
