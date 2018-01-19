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
        overflow: hidden;
        border: 5px solid rgb(118, 218, 255);
        border-radius: 50%;
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
        }

        &::before {
            z-index: 10;
            border-radius: 45%;
            background-color: rgba(255, 255, 255, .4);
            transform: translate(-50%, -70%) rotate(0);
            animation: rotate 6s linear infinite;
        }

        &::after {
            z-index: 20;
            border-radius: 47%;
            background-color: rgba(255, 255, 255, .9);
            transform: translate(-50%, -70%) rotate(0);
            animation: rotate 10s linear -5s infinite;
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
