<style lang="less" scoped>
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    font-size: 100px;
    font-weight: bold;
    text-transform: uppercase;
    background: black;
}

.p1 {
    color: transparent;
    background-image: url(~images/blue-sky.jpg);
    background-repeat: no-repeat;
    background-position: 50% 78%;
    -webkit-background-clip: text;
    background-clip: text;
}
.p2 {
    color: transparent;
    background-image: url(https://media.giphy.com/media/YnkuiP6WFNM2ezj0XV/giphy.gif);
    background-size: contain;
    background-position: top left;
    -webkit-background-clip: text;
    background-clip: text;
}
</style>

<template>
    <main>
        <p class="p1">hello caigua</p>
        <p class="p2">nice to meet you</p>
    </main>
</template>

<script>
    export default {}
</script>
