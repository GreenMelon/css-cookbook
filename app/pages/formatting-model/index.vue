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
                        name: 'align',
                        instances: [
                            {
                                name: '垂直对齐',
                                route: '/formatting-model/align/vertical-align'
                            }
                        ]
                    },{
                        name: 'column',
                        instances: [
                            {
                                name: 'column-count',
                                route: '/formatting-model/column/column-count'
                            }
                        ]
                    },{
                        name: 'flex',
                        instances: [
                            {
                                name: '01',
                                route: '/formatting-model/flex/01'
                            }
                        ]
                    },{
                        name: 'grid',
                        instances: [
                            {
                                name: '01',
                                route: '/formatting-model/grid/01'
                            }
                        ]
                    },{
                        name: 'shape',
                        instances: [
                            {
                                name: 'circle',
                                route: '/formatting-model/shape/circle'
                            },{
                                name: 'polygon',
                                route: '/formatting-model/shape/polygon'
                            }
                        ]
                    },
                ]
            }
        },
    }
</script>
