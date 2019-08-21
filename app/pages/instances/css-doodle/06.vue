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
                @grid: 16 / 320px; 
            }

            @size: 1px calc(100% * @sqrt(2) + 1px);

            margin: auto;
            background: #000;
            transform: rotate(@p(45deg, -45deg));
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