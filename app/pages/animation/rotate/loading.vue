<style lang="less" scoped>
    @keyframes rotete {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .circle {
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-left-color: deeppink;
        border-radius: 50%;
        animation: rotete 1.2s linear infinite;
    }
</style>

<template>
    <main>
        <div class="circle"></div>
    </main>
</template>

<script>
    export default {}
</script>
