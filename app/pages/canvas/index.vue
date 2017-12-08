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
                        name: 'drawImage',
                        instances: [
                            {
                                name: '001',
                                route: '/canvas/draw-image/001'
                            },{
                                name: '002',
                                route: '/canvas/draw-image/002'
                            },{
                                name: '003',
                                route: '/canvas/draw-image/003'
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
