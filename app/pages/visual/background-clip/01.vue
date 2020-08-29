<style lang="less" scoped>
    .demo {
        box-sizing: border-box;
        width: 400px;
        height: 300px;
        margin: 10px;
        border: 10px dashed #000;
        padding: 20px;

        background-image: url("~images/superman.jpg");
        background-repeat: no-repeat;
        background-color: #007dd4;
        background-clip: border-box;
        background-clip: padding-box;
        background-clip: content-box;
    }
</style>

<template>
    <main>
        <div class="demo"></div>
    </main>
</template>

<script>
export default {}
</script>
