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
                    route: '01',
                }
            ]
        }
    },
}
</script>
