<style lang="css" scoped>
@import url('https://fonts.googleapis.com/css?family=Gochi+Hand');

main {
    padding: 40vh 30vw;
    font-family: 'Gochi Hand', cursive;
    font-size: 130%;  
    text-align: left;
    color: hsl(198, 1%, 29%);
    background-color: #ffb7b0;
}

h2 {
    display: inline;
    line-height: 1.5;
    background-image: linear-gradient(
        transparent 50%,
        #e1fffe 50%,
        #b0f8ff 85%,
        transparent 85%,
        transparent 100%
    );
    background-repeat: no-repeat;
    background-size: 0% 100%;
    animation: animatedBackground 2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.5s forwards;
}

@keyframes animatedBackground {
    to {
        background-size: 100% 100%;
    }
}
</style>

<template>
    <main>
        <h2>This is a multi-line spanning animated underline. This took an annoyingly long time to figure out.</h2>
    </main>
</template>

<script>
export default {}
</script>
