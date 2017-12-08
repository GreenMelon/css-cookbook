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
                        name: 'line',
                        instances: [
                            {
                                name: '001',
                                route: '/svg/line/1'
                            }
                        ]
                    },{
                        name: 'triangle',
                        instances: [
                            {
                                name: '001',
                                route: '/svg/triangle/1'
                            }
                        ]
                    },{
                        name: 'rectangle',
                        instances: [
                            {
                                name: '001',
                                route: '/svg/rectangle/1'
                            }
                        ]
                    },{
                        name: 'circle',
                        instances: [
                            {
                                name: '001',
                                route: '/svg/circle/1'
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
