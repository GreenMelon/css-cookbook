<style lang="less" scoped>
    @import '../../../less/base/mixin.less';

    .moon-night {
        position: relative;
        margin: 10px auto;
        width: 600px;
        height: 500px;
        overflow: hidden;
        background-color: #000;
    }
    .moon {
        @color: rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 10px;
        left: 60px;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background-color: #fff;
        &::after {
            .center;
            content: "";
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: @color;
            box-shadow:
                120px  80px 0  2px @color,
                100px -60px 0 -7px @color,
                -70px  40px 0 -14px @color,
                -20px -50px 0 -15px @color,
                -20px 120px 0 -15px @color,
                 50px  50px 0 -15px @color;
        }
    }
    .moutain {
        @color: #214362;
        position: absolute;
        bottom: -120px;
        left: 200px;
        width: 220px;
        height: 220px;
        border-radius: 20px;
        background-color: #214362;
        transform: rotate(45deg);
        box-shadow:
            -170px  110px 0  2px @color;
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <div class="moon-night">
            <div class="moon"></div>
            <div class="moutain"></div>
        </div>
    </main>
</template>

<script>
    export default {};
</script>
