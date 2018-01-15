<style lang="less" scoped>
    .chessboard {
        width: 300px;
        height: 300px;
        border: 1px solid;
        margin-left: 30px;
        background: conic-gradient(#000 25%, #fff 0 50%, #000 0 75%, #fff 0);
        background-size: 30px 30px;
    }
</style>

<template>
    <main>
        <div class="chessboard"></div>
    </main>
</template>

<script>
    export default {
        methods: {
            loadScript() {
                //http://leaverou.github.io/conic-gradient/conic-gradient.js
            },
        },
        mounted() {
            this.loadScript();
        }
    }
</script>
