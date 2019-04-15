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
                        name: 'font',
                        instances: [
                            {
                                name: 'font-family',
                                route: '/typographic/font/font-family'
                            },{
                                name: 'font-smoothing',
                                route: '/typographic/font/font-smoothing'
                            }
                        ]
                    },{
                        name: 'text',
                        instances: [
                            {
                                name: 'text-align',
                                route: '/typographic/text/text-align'
                            },{
                                name: 'text-align-justify',
                                route: '/typographic/text/text-align-justify'
                            },{
                                name: 'text-shadow',
                                route: '/typographic/text/text-shadow'
                            },{
                                name: 'text-fill-color',
                                route: '/typographic/text/text-fill-color'
                            },{
                                name: 'text-stroke',
                                route: '/typographic/text/text-stroke'
                            },{
                                name: 'text-shadow mosaic',
                                route: '/typographic/text/text-shadow/mosaic'
                            },{
                                name: 'text-transform',
                                route: '/typographic/text/text-transform'
                            },{
                                name: 'writing-mode',
                                route: '/typographic/text/writing-mode'
                            },{
                                name: 'text-decoration',
                                route: '/typographic/text/text-decoration'
                            }
                        ]
                    },{
                        name: 'text-effect',
                        instances: [
                            {
                                name: 'text-outline',
                                route: '/typographic/text-effect/text-outline'
                            },{
                                name: 'image-text',
                                route: '/typographic/text-effect/image-text'
                            },{
                                name: 'flash-light',
                                route: '/typographic/text-effect/flash-light'
                            }
                        ]
                    },{
                        name: 'wrap',
                        instances: [
                            {
                                name: 'overflow-wrap',
                                route: '/typographic/wrap/overflow-wrap'
                            },{
                                name: 'line-clamp',
                                route: '/typographic/wrap/line-clamp'
                            }
                        ]
                    }
                ]
            }
        },
    }
</script>
