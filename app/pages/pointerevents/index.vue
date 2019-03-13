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
                        name: 'pointer-events',
                        instances: [
                            {
                                name: 'pointer-events',
                                route: '/pointer-events/01'
                            }
                        ]
                    },{
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
