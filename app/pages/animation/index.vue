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
            baseRoute: '/animation',
            categories: [
                {
                    name: 'rotate',
                    children: [
                        {
                            route: 'loading',
                        }, {
                            route: '01',
                        },
                    ],
                },
            ],
        }
    },
}
</script>
