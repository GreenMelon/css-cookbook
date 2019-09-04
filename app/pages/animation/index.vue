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
            baseRoute: '/animation',
            items: [
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
