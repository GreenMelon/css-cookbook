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
                        name: 'skew',
                        instances: [
                            {
                                name: '平行四边形',
                                route: '/transform/skew/parallelogram'
                            }
                        ]
                    }
                ]
            }
        },
    }
</script>