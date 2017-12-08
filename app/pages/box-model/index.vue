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
                        name: 'clip',

                        instances: [
                            {
                                name: 'reverse clip-path with blend-modes',
                                route: '/box-model/clip/reverse-clip-path-with-blend-modes'
                            }
                        ]
                    },{
                        name: 'border',
                        instances: [
                            {
                                name: '透明边框',
                                route: '/visual/background-clip/1'
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
