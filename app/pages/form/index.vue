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
            baseRoute: '/Form',
            categories: [
                {
                    name: 'autocomplete',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'cancel-button',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'cursor',
                    children: [
                        {
                            route: '01',
                        },
                    ],
                }, {
                    name: 'input',
                    children: [
                        {
                            route: 'checkbox-01',
                        }, {
                            route: 'checkbox-02',
                        }, {
                            route: 'checkbox-03',
                        }, {
                            route: 'number',
                        }, {
                            route: 'file',
                        },
                    ],
                }, {
                    name: 'spellcheck',
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
