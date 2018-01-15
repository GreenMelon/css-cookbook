<style lang="less" scoped>
    .chessboard {
        height: 300px;
        width: 300px;
        border: 1px solid;
        background-image: linear-gradient(45deg, #000 25%, transparent 0, transparent 75%, #000 0),
                        linear-gradient(45deg, #000 25%, transparent 0, transparent 75%, #000 0);
        background-position: 0 0, 15px 15px;
        background-size: 30px 30px;
    }
</style>

<template>
    <main>
        <div class="chessboard"></div>
    </main>
</template>

<script>
    export default {}
</script>
