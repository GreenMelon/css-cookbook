<template>
    <main>
        <categories :categories="categories"></categories>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                categories: [
                    {
                        name: 'spellcheck',
                        instances: [
                            {
                                name: '1',
                                route: '/form./spellcheck/1'
                            }
                        ]
                    },{
                        name: 'autocomplete',
                        instances: [
                            {
                                name: '1',
                                route: '/form./autocomplete/1'
                            }
                        ]
                    },{
                        name: 'cursor',
                        instances: [
                            {
                                name: '1',
                                route: '/form./cursor/1'
                            }
                        ]
                    }
                ]
            }
        },
        methods: {
            //
        },
        created() {
            //
        }
    }
</script>
