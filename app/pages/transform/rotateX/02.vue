<style lang="less" scoped>
main {
    overflow: hidden;
    background: black;
}

h1 {
    margin: 200px auto;
    overflow: hidden;
    font-family: arial;
    font-size: 4.5rem;
    font-weight: 900;
    text-align: center;
    color: transparent;
    background: linear-gradient(45deg, black 30%, transparent 30%, transparent 70%, black 70%), linear-gradient(-45deg, black 30%, transparent 30%, transparent 70%, black 70%), linear-gradient(90deg, crimson 30%, transparent 30%, transparent 70%, crimson 70%)red;
    background-size: 20px 20px, 20px 20px, 1px 1px;
    background-position: 0 0, 0 0, 0 0;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-stroke: 4px white;
    filter: drop-shadow(0 0 1px black)drop-shadow(0 0 1px black)drop-shadow(0 0 1px black)drop-shadow(0 0 1px black)drop-shadow(0 0 1px black)drop-shadow(0 0 1px black)drop-shadow(0 0 1px black)drop-shadow(0 0 1px black)drop-shadow(0 0 2px crimson);
    animation: bg-shift 1s ease-in-out infinite alternate-reverse, swing 2s ease-in-out infinite;
}

h1::before {
    content: "BLACK AND WHITE";
    position: absolute;
    background: linear-gradient(transparent 30%, white, transparent 70%);
    -webkit-background-clip: text;
    background-clip: text;
    animation: bg-shift2 2s ease-in-out infinite alternate-reverse;
    -webkit-text-stroke: 2px red;
}

@keyframes bg-shift {
    from {
        background-position: 0 50px;
    }
}

@keyframes bg-shift2 {
    0% {
        background-position: 0 50px;
    }

    50% {
        background-position: 0 -50px;
    }

    100% {
        background-position: 0 50px;
    }
}

@keyframes swing {
    0% {
        transform-origin: top;
        transform: perspective(550px) rotatex(55deg);
    }

    50% {
        transform: perspective(550px) rotatex(-55deg);
    }

    100% {
        transform-origin: top;
        transform: perspective(550px) rotatex(55deg);
    }
}
</style>

<template>
    <main>
        <h1>BLACK AND WHITE</h1>
    </main>
</template>

<script>
    export default {};
</script>
