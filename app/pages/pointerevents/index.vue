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
            baseRoute: 'pointerevents',
            categories: [
                {
                    name: 'pointer-events',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'touch-action',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }
            ]
        }
    },
}
</script>
