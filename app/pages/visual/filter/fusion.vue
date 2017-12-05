<style lang="less" scoped>
    .fusion {
        position: relative;
        width: 300px;
        height: 200px;
        filter: contrast(20);
        background: #fff;
        &::before,
        &::after {
            content: "";
            position: absolute;
            top: 50%;
            border-radius: 50%;
            transform: translateY(-50%);
            filter: blur(4px);
        }
        &::before {
            left: 40px;
            width: 120px;
            height: 120px;
            background: #000;
            animation: move-ball 4s ease-out infinite;
        }
        &::after {
            right: 40px;
            width: 80px;
            height: 80px;
            background: #f00;
            animation: move-ball-2 4s ease-out infinite;
        }
    }

    @keyframes move-ball {
        50% {
            left: 140px;
        }
    }

    @keyframes move-ball-2 {
        50% {
            right: 180px;
        }
    }
</style>

<template>
    <main>
        <div class="fusion"></div>
    </main>
</template>

<script>
    export default {};
</script>
