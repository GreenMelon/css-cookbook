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
                        name: 'hexagon',
                        instances: [
                            {
                                name: 'border',
                                route: '/exercism/hexagon/border'
                            },{
                                name: 'transform',
                                route: '/exercism/hexagon/transform'
                            },{
                                name: 'svg',
                                route: '/exercism/hexagon/svg'
                            },{
                                name: 'canvas',
                                route: '/exercism/hexagon/canvas'
                            }
                        ]
                    },{
                        name: 'float-center',
                        instances: [
                            {
                                name: 'float',
                                route: '/exercism/float-center/float'
                            },{
                                name: 'shape',
                                route: '/exercism/float-center/shape'
                            }
                        ]
                    },{
                        name: 'tai-chi',
                        instances: [
                            {
                                name: '1',
                                route: '/exercism/tai-chi/1'
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
