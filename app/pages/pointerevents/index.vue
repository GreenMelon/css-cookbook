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
                        name: 'touch-action',
                        instances: [
                            {
                                name: 'touch-action',
                                route: '/touch-action/01'
                            }
                        ]
                    }
                ]
            }
        },
    }
</script>
