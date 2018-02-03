<style lang="less" scoped>
    div {
        height: 250px;
        margin: 50px auto;
        background-size: 50px 50px;

        background-image: linear-gradient(45deg, red 25%, transparent 25%, transparent),
                          linear-gradient(-45deg, green 25%, transparent 25%, transparent),
                          linear-gradient(45deg, transparent 75%, yellow 75%),
                          linear-gradient(-45deg, transparent 75%, blue 75%);
    }
</style>

<template>
    <main>
        <div></div>
    </main>
</template>

<script>
    export default {}
</script>
