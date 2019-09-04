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
            baseRoute: '/formatting-model',
            items: [
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
                    name: 'flex',
                    children: [
                        {
                            route: '01'
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
