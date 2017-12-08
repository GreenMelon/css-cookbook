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
                        name: 'grid',
                        instances: [
                            {
                                name: '001',
                                route: '/formatting-model/grid/01'
                            }
                        ]
                    },{
                        name: 'shape',
                        instances: [
                            {
                                name: 'shape - circle',
                                route: '/formatting-model/shape/1'
                            },{
                                name: 'shape - polygon',
                                route: '/formatting-model/shape/2'
                            }
                        ]
                    },{
                        name: '对齐',
                        instances: [
                            {
                                name: '垂直对齐',
                                route: '/formatting-model/align/vertical-align'
                            }
                        ]
                    },
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
