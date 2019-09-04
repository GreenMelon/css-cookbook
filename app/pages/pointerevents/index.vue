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
            baseRoute: 'pointerevents',
            items: [
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
