<style lang="less" scoped>
    @width: 24px;

    .tai-chi {
        position: relative;
        display: block;
        box-sizing: content-box;
        margin: 0 auto;
        width: 8 * @width;
        height: 4 * @width;
        border-width: 2px 2px unit(4 * @width + 2, px) 2px;
        border-color: #000;
        border-style: solid;
        border-radius: 100%;
        background: #fff;
    }

    .tai-chi::before,
    .tai-chi::after {
        content: '';
        position: absolute;
        top: 50%;
        width: @width;
        height: @width;
        border-radius:100%;
    }

    .tai-chi::before {
        left: 0;
        border: unit(1.5 * @width, px) solid #000;
        background: #fff;
    }

    .tai-chi::after {
        left: 50%;
        border: unit(1.5 * @width, px) solid #fff;
        background: #000;
    }
</style>

<template>
    <main>
        <i class="tai-chi"></i>
    </main>
</template>

<script>
    export default {}
</script>
