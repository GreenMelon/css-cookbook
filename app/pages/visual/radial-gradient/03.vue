<style lang="css" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #333641;
}

div {
    font-size: 8vw;
    text-transform: uppercase;
    color: transparent;
    background:
        50% 100% / 50% 50% no-repeat
        radial-gradient(ellipse at bottom, white, transparent, transparent)
    ;
    -webkit-background-clip: text;
    background-clip: text;
    animation:
        reveal 3000ms ease-in-out forwards 200ms,
        glow 2500ms linear infinite 2000ms
    ;
}

@keyframes reveal {
    80% {
        letter-spacing: 8px;
    }
    100% {
        background-size: 300% 300%;
    }
}
@keyframes glow {
    40% {
        text-shadow: 0 0 8px white;
    }
}
</style>

<template>
    <main>
        <div>hello world</div>
    </main>
</template>

<script>
export default {}
</script>
