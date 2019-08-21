<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
</style>

<template>
    <main>
        <css-doodle>
            :doodle {
                @grid: 20 / 100vmax; 
            }

            transition: @rand(500ms) ease;

            background: @pick(
                #240041, #900048, #FF4057, #FF8260
            );

            clip-path: polygon(@pick(
                '0 0, 100% 0, 100% 100%',
                '0 0, 100% 0, 0 100%',
                '0 0, 100% 100%, 0 100%',
                '100% 0, 100% 100%, 0 100%'
            ));

            /* the sub-pixel problem */
            margin: -.2px;
        </css-doodle>
    </main>
</template>

<script>
    import 'css-doodle';

    export default {
        mounted() {
            this.init();
        },

        methods: {
            init() {
                this.$el.addEventListener('click', evt => {
                    evt.target.update && evt.target.update();
                });
            },
        },
    };
</script>
