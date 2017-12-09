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
                        name: 'border',
                        instances: [
                            {
                                name: '透明边框',
                                route: '/visual/background-clip/transparent-border'
                            }
                        ]
                    },{
                        name: 'clip',
                        instances: [
                            {
                                name: '背景裁切',
                                route: '/box-model/clip/01'
                            },{
                                name: 'reverse clip-path with blend-modes',
                                route: '/box-model/clip/reverse-clip-path-with-blend-modes'
                            }
                        ]
                    },
                ]
            }
        }
    }
</script>
