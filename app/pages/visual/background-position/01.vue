<style lang="less" scoped>
main {
    background-color: #f1f1f1;
}

.cup {
    position: absolute;
    top: 40%;
    left: 40%;
    width: 180px;
    height: 140px;
    border: 6px solid #f1f1f1;
    border-radius: 0px 0px 70px 70px;
    background: url("https://img.freepik.com/free-photo/full-frame-shot-brown-leather-background_23-2147951253.jpg?size=626&ext=jpg");
    background-repeat: repeat-x;
    background-position: 0px 140px;
    box-shadow: 0px 0px 0px 6px white;
    animation: fill 2.5s infinite;
}

.handle {
    position: relative;
    top: 2px;
    left: 186px;
    width: 40px;
    height: 70px;
    border: 6px solid white;
    border-radius: 0px 25px 80px 0px;
    background-color: transparent;
}

@keyframes fill {
    0% {
        background-position: 0px 140px;
    }
    20% {
        background-position: -450px 100px;
    }
    40% {
        background-position: -900px 50px;
    }
    80% {
        background-position: -1350px -40px;
    }
}
</style>

<template>
    <main>
        <div class="cup">
            <div class="handle"></div>
        </div>
    </main>
</template>

<script>
    export default {}
</script>
