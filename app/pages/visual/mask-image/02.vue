<style lang="less" scoped>
    .container {
        position: relative;
        margin: 10px auto;
        width: 600px;
        height: 460px;
        border: 10px solid #c7254e;
    }

    .img-left,
    .img-right {
        width: 100%;
        height: 100%;
        -webkit-background-size: cover;
                background-size: cover;
    }

    .img-left {
        background: url("~images/superman.jpg");
    }

    .img-right {
        position: absolute;
        top: 0;
        right: 0;
        background: url("~images/superman.jpg");
        background-position: 115px 0;
        -webkit-mask-image: -webkit-linear-gradient(left top, transparent 50%, white 50%);
    }
</style>

<template>
    <main>
        <div class="container">
            <div class="img-left"></div>
            <div class="img-right"></div>
        </div>
    </main>
</template>

<script>
    export default {}
</script>
