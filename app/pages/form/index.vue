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
                        name: 'autocomplete',
                        instances: [
                            {
                                name: '01',
                                route: '/form./autocomplete/01'
                            }
                        ]
                    },{
                        name: 'cancel-button',
                        instances: [
                            {
                                name: '01',
                                route: '/form./cancel-button/01'
                            }
                        ]
                    },{
                        name: 'cursor',
                        instances: [
                            {
                                name: '01',
                                route: '/form./cursor/01'
                            }
                        ]
                    },{
                        name: 'input[type=file]',
                        instances: [
                            {
                                name: '01',
                                route: '/form./file/01'
                            }
                        ]
                    },{
                        name: 'spellcheck',
                        instances: [
                            {
                                name: '01',
                                route: '/form./spellcheck/01'
                            }
                        ]
                    },
                ]
            }
        },
    }
</script>
