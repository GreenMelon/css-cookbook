<style lang="less" scoped>
main {
    overflow: hidden;
    background: lime;
}

h1 {
    position: relative;
    bottom: 0px;
    font-family: arial;
    font-size: 19em;
    font-weight: 900;
    text-align: center;
    color: transparent;
    -webkit-text-stroke: 7px black;
    background: repeating-linear-gradient(45deg, black, lime 5px);
    -webkit-background-clip: text;
    background-clip: text;
    animation: float 2s ease-in-out infinite;
}

h1::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    -webkit-text-stroke: 12px lightgreen;
    background: repeating-linear-gradient(-45deg, black, transparent 5px);
    -webkit-background-clip: text;
    background-clip: text;
}

h1::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 0 0, transparent 40%, rgba(255,255, 255, 0.6), transparent 60%);
    -webkit-background-clip: text;
    background-clip: text;
    animation: shine 2s ease-in-out infinite;
}

@keyframes float{
    0% {
        transform: perspective(500px) rotatey(30deg);
    }
    50% {
        transform: perspective(500px) rotatey(-30deg);
    }
    100% {
        transform: perspective(500px) rotatey(30deg);
    }
}

@keyframes shine {
    0% {
        background-position: -300px;
    }
    50% {
        background-position: 300px;
    }
    100% {
        background-position: -300px;
    }
}
</style>

<template>
    <main>
        <h1 data-text="CSS">CSS</h1>
    </main>
</template>

<script>
    export default {};
</script>
