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
                        name: 'test',
                        instances: [
                            {
                                name: 'scrollTop',
                                route: '/test/scroll-top'
                            },{
                                name: 'brace',
                                route: '/test/brace'
                            },{
                                name: 'clipboard',
                                route: '/test/clipboard/001'
                            },{
                                name: 'FileReader',
                                route: '/test/filereader/image'
                            },
                        ],
                    }
                ],
            }
        },
    }
</script>
