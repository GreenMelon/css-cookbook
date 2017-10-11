<style lang="less" scoped>
    .demo {
        position: relative;
        width: 82px;
        height: 181px;
        margin: 100px auto;
        background: url(../../../images/superman.png);
        background-size: 100% 100%;
        &::after {
            content: "";
            position: absolute;
            top: 10%;
            left: 10%;
            width: 100%;
            height: 100%;
            background: inherit;
            background-size: 100% 100%;
            filter: blur(10px) brightness(80%) opacity(.8);
        }
    }
</style>

<template>
    <main>
        <div class="demo"></div>
    </main>
</template>

<script>
    export default {};
</script>
