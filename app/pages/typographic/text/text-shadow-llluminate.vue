<style lang="less" scoped>
    main {
        background-color: #000;
    }

    .container {
        font-size: 50px;
        text-align: center;
        color: #fff;
        transition: all .5s;
        &:hover {
            font-size: 100px;
            letter-spacing: 50px;
            text-shadow:
                0 0 5px #fff,
                0 0 10px #fff,
                0 0 15px #fff,
                0 0 20px #FF9900,
                0 0 35px #FF9900,
                0 0 40px #FF9900,
                0 0 50px #FF9900,
                0 0 75px #FF9900;
            .line {
                width: 100%;
            }
        }
    }

    .line {
        margin: 40px auto;
        width: 0;
        height: 8px;
        border-radius: 4px;
        background: #fff;
        transition: all 1s;
    }
</style>

<template>
    <main>
        <h1 class="container">
            caigua
            <p class="line"></p>
        </h1>
    </main>
</template>

<script>
    export default {}
</script>
