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
                        name: 'border-radius',
                        instances: [
                            {
                                name: '1',
                                route: '/draw/border-radius/1'
                            }
                        ]
                    },{
                        name: 'clip',
                        instances: [
                            {
                                name: '1',
                                route: '/draw/clip/1'
                            }
                        ]
                    },{
                        name: 'radial-gradient',
                        instances: [
                            {
                                name: '1',
                                route: '/draw/radial-gradient/1'
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
