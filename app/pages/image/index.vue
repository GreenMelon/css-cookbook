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
                        name: 'srcset',
                        instances: [
                            {
                                name: '001',
                                route: '/image/srcset/001'
                            }
                        ]
                    },{
                        name: 'sizes',
                        instances: [
                            {
                                name: '001',
                                route: '/image/sizes/001'
                            }
                        ]
                    },{
                        name: 'usemap',
                        instances: [
                            {
                                name: '001',
                                route: '/image/usemap/001'
                            }
                        ]
                    },{
                        name: 'image-set',
                        instances: [
                            {
                                name: '001',
                                route: '/image/image-set/001'
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
