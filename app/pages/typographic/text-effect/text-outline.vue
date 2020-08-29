<style lang="less" scoped>
    p {
        position: relative;
        height: 200px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 128px;
        text-align: center;
        &::before,
        &::after {
            content: attr(aria-text);
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            background: transparent;
            transform: translate(-50%, -50%);
        }
        &::before {
            z-index: 2;
            -webkit-text-stroke: 2px #fff;
        }
        &::after {
            z-index: 1;
            -webkit-text-stroke: 8px #000;
        }
    }
</style>

<template>
    <main>
        <p aria-text="青岑可浪 碧海可尘"></p>
    </main>
</template>

<script>
export default {}
</script>
