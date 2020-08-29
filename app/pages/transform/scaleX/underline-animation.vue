<style lang="less" scoped>
    .underline-animation {
        position: relative;
        display: inline-block;
        font-size: 16px;
        color: #0087ca;
        &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #e94c97;
            transform: scaleX(0);
            transform-origin: bottom right;
            transition: transform 0.25s ease-out;
        }
        &:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
        }
    }
</style>

<template>
    <main>
        <p class="underline-animation">Hover this text to see the effect!</p>
    </main>
</template>

<script>
export default {}
</script>
