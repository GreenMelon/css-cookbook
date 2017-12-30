<style lang="less" scoped>
    main {
        position: relative;
    }
    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-sizing: content-box;
        width: 200px;
        height: 200px;
        padding: 5px;
        border: 5px solid rgb(118, 218, 255);
        border-radius: 50%;
        overflow: hidden;
    }
    .wave {
        position: relative;
        width: 200px;
        height: 200px;
        background-color: rgb(118, 218, 255);
        border-radius: 50%;

        &::before,
        &::after{
            content: "";
            position: absolute;
            top: 0;
            left: 50%;
            width: 400px;
            height: 400px;
            background-color: rgba(255, 255, 255, .4);
            border-radius: 45%;
            transform: translate(-50%, -70%) rotate(0);
            animation: rotate 6s linear infinite;
            z-index: 10;
        }

        &::after {
            border-radius: 47%;
            background-color: rgba(255, 255, 255, .9);
            transform: translate(-50%, -70%) rotate(0);
            animation: rotate 10s linear -5s infinite;
            z-index: 20;
        }
    }

    @keyframes rotate {
        50% {
            transform: translate(-50%, -73%) rotate(180deg);
        }
        100% {
            transform: translate(-50%, -70%) rotate(360deg);
        }
    }

</style>

<template>
    <main>
        <div class="container">
            <div class="wave"></div>
        </div>
    </main>
</template>

<script>
    export default {};
</script>
