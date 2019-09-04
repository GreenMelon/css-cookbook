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
            baseRoute: '/table',
            items: [
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
