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
                @grid: 24 / 35em 20em; 
                overflow: hidden;
            }

            :after {
                content: '\@hex(@rand(0x2500, 0x257f))';
                font-size: 1.8em;
                color: @pick(#FEF5E9, #FECDB7, #FBA5B5, #FD5578);
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
