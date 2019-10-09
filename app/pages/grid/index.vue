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
            baseRoute: '/grid',
            categories: [
                {
                    alias: '总览',
                    route: '01',
                }, {
                    alias: '瀑布流',
                    route: '02',
                }
            ]
        }
    },
}
</script>
