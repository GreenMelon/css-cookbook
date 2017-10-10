<style lang="less" scoped>
    .waveline(@color, @h) {
        position: relative;
        &::after {
            content: '';
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            height: @h;
            background: linear-gradient(135deg, transparent, transparent 45%, @color, transparent 55%, transparent 100%),
                        linear-gradient(45deg, transparent, transparent 45%, @color, transparent 55%, transparent 100%);
            background-size: @h * 2 @h * 2;
        }
    }

    span {
        .waveline(red, 5px);
        font-size: 24px;
    }
</style>

<template>
    <main>
        <span>waveline</span>
    </main>
</template>

<script>
    export default {}
</script>
