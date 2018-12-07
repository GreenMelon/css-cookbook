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
                        name: 'element',
                        instances: [
                            {
                                name: 'dialog',
                                route: '/element/dialog'
                            },{
                                name: 'progress',
                                route: '/element/progress'
                            },{
                                name: 'a',
                                route: '/element/a'
                            },{
                                name: 'li',
                                route: '/element/li'
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>
