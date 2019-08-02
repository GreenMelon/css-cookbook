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
                        name: 'rotate',
                        instances: [
                            {
                                name: 'loading',
                                route: '/animation/rotate/loading'
                            },{
                                name: '01',
                                route: '/animation/rotate/01'
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>
