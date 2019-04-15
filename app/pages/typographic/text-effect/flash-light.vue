<style lang="less" scoped>
    .box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10em;
        height: 1.2em;
        font-size: 5em;
    }
    .up,
    .down {
        position: absolute;
        height: 100%;
        line-height: 1;
    }
    .up {
        z-index: 2;
        width: 1em;
        overflow: hidden;
        color: gold;
        border-radius: 50%;
        animation: run-outside 8s infinite;
    }
    .up::before {
        content: attr(text);
        position: absolute;
        width: 10em;
        animation: run-inside 8s infinite;
    }
    .down {
        z-index: 1;
        color: rebeccapurple;
    }
    @keyframes run-outside {
        0% { left: -1em; }
        100% { left: 10em; }
    }
    @keyframes run-inside {
        0% { left: 1em; }
        100% { left: -10em; }
    }
</style>

<template>
    <main>
        <div class="box">
            <div class="down">菜瓜❤️CAIGUA❤️菜瓜</div>
            <div class="up" text="菜瓜❤️CAIGUA❤️菜瓜"></div>
        </div>
    </main>
</template>

<script>
    export default {}
</script>
