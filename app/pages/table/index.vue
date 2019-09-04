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
            baseRoute: '/table',
            categories: [
                {
                    name: 'table-layout',
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
