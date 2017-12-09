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
                                name: '01',
                                route: '/image/srcset/01'
                            }
                        ]
                    },{
                        name: 'sizes',
                        instances: [
                            {
                                name: '01',
                                route: '/image/sizes/01'
                            }
                        ]
                    },{
                        name: 'usemap',
                        instances: [
                            {
                                name: '01',
                                route: '/image/usemap/01'
                            }
                        ]
                    },{
                        name: 'image-set',
                        instances: [
                            {
                                name: '01',
                                route: '/image/image-set/01'
                            }
                        ]
                    }
                ]
            }
        },
    }
</script>
