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
    }
</script>
