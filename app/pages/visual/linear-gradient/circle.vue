<style lang="less" scoped>
    .circle-01 {
        position: relative;
        margin: 10px auto;
        width: 300px;
        height: 300px;
        overflow: hidden;
        border-radius: 50%;
        -webkit-mask: radial-gradient(transparent, transparent 110px, #000 110px);
                mask: radial-gradient(transparent 110px, #000 110px);
        .left,
        .right {
            width: 50%;
            height: 100%;
        }
        .left {
            float: left;
            background: linear-gradient(to bottom, #EDE604, #FFCC00, #FEAC00, #FF8100, #FF5800, #FF3BA7, #CC42A2);
        }
        .right {
            float: right;
            background: linear-gradient(to bottom, #9ED110, #50B517, #179067, #476EAF, #9f49ac, #CC42A2);
        }
        .top,
        .bottom {
            position: absolute;
            left: 50%;
            margin-left: -15px;
            height: 40px;
            width: 30px;
            -webkit-filter: blur(5px);
                    filter: blur(5px);
        }
        .top {
            top: 0;
            background: linear-gradient(to right, #EDE604, #9ED110);
        }
        .bottom {
            bottom: 0;
            background: linear-gradient(to right, #DB3FA3, #C443A3);
        }
    }
    .circle-02 {
        margin: 10px auto;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
        -webkit-mask: radial-gradient(transparent, transparent 110px, #000 110px);
                mask: radial-gradient(transparent 110px, #000 110px);
    }
</style>

<template>
    <main>
        <div class="circle-01">
            <div class="left"></div>
            <div class="right"></div>
            <div class="top"></div>
            <div class="bottom"></div>
        </div>
        <div class="circle-02"></div>
    </main>
</template>

<script>
    export default {}
</script>
