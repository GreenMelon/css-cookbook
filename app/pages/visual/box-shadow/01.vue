<style lang="less" scoped>
main {
    overflow: hidden;
    background: linear-gradient(90deg, hsl(199, 98%, 50%), hsl(199, 98%, 38%));
}

div {
    position: relative;
    margin: 30vmin auto;
    width: 30vmin;
    height: 30vmin;
    background: #fff;
}

div::before,
div::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
}

div::before {
    background: linear-gradient(90deg, rgba(0, 0, 0, .3), transparent);
    transform-origin: 0 50%;
    transform: translate(100%, 0) skewY(45deg) scaleX(.6);
    // animation: shadowMoveY 5s infinite linear alternate;
}

div::after {
    background: linear-gradient(180deg, rgba(0, 0, 0, .3), transparent);
    transform-origin: 0 0;
    transform: translate(0%, 100%) skewX(45deg) scaleY(.6);
    // animation: shadowMoveX 5s infinite linear alternate;
}

@keyframes shadowMoveX {
    to {
        transform: translate(0%, 100%) skewX(50deg) scaleY(.6);
    }
}

@keyframes shadowMoveY {
    to {
        transform: translate(100%, 0) skewY(40deg) scaleX(.6);
    }
}
</style>

<template>
    <main>
        <div></div>
    </main>
</template>

<script>
export default {}
</script>
