<style lang="less" scoped>
    .circle {
        margin: 10px auto;
        width: 300px;
        height: 300px;
        background: conic-gradient(red, orange, yellow, green, blue, indigo, violet, red);
        border-radius: 50%;
        -webkit-mask: radial-gradient(transparent, transparent 110px, #000 110px);
                mask: radial-gradient(transparent 110px, #000 110px);
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
