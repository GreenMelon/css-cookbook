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
            baseRoute: '/formatting-model',
            categories: [
                {
                    name: 'align',
                    children: [
                        {
                            alias: '垂直对齐',
                            route: 'vertical-align',
                        },
                    ],
                }, {
                    name: 'column',
                    children: [
                        {
                            route: 'column-count',
                        },
                    ],
                }, {
                    name: 'grid',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'shape',
                    children: [
                        {
                            route: 'circle',
                        }, {
                            route: 'polygon',
                        },
                    ],
                },
            ],
        }
    },
}
</script>
