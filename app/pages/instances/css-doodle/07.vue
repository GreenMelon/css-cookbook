<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<template>
    <main>
        <css-doodle>
            :doodle {
                @grid: 10 / 60vmin;
                background: #fff;
            }

            overflow: hidden;
            background: #000;

            :after {
                content: '';
                position: absolute;
                @size: 100%;
                border-radius: 50%;
                background: #fff;
                transform: translate(@p(
                    (0, 50%), (50%, 0),
                    (0, -50%), (-50%, 0)
                ));
            }

            @random(.3) {
                filter: invert(1);
            }
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