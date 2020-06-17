<style lang="less" scoped>
.circle {
    position: relative;
    margin: 10px auto;
    width: 300px;
    height: 300px;
    overflow: hidden;
    border-radius: 50%;
    -webkit-mask: radial-gradient(transparent, transparent 110px, #000 110px);
            mask: radial-gradient(transparent 110px, #000 110px);
}
.circle-group {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform: scale(1.2);
    -webkit-filter: blur(15px);
            filter: blur(15px);
    i {
        position: absolute;
        overflow: hidden;
        width: 100%;
        height: 100%;
        clip: rect(0 300px 300px 150px);
        &:after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            clip: rect(0 150px 300px 0);
            border-radius: 50%;
            background: currentColor;
            transform: rotate(31deg);
        }
        &:first-of-type {
            transform: rotate(0deg);
            color: #9ED110;
        }
        &:nth-of-type(2) {
            transform: rotate(30deg);
            color: #50B517;
        }
        &:nth-of-type(3) {
            transform: rotate(60deg);
            color: #179067;
        }
        &:nth-of-type(4) {
            transform: rotate(90deg);
            color: #476EAF;
        }
        &:nth-of-type(5) {
            transform: rotate(120deg);
            color: #9f49ac;
        }
        &:nth-of-type(6) {
            transform: rotate(150deg);
            color: #CC42A2;
        }
        &:nth-of-type(7) {
            transform: rotate(180deg);
            color: #FF3BA7;
        }
        &:nth-of-type(8) {
            transform: rotate(210deg);
            color: #FF5800;
        }
        &:nth-of-type(9) {
            transform: rotate(240deg);
            color: #FF8100;
        }
        &:nth-of-type(10) {
            transform: rotate(270deg);
            color: #FEAC00;
        }
        &:nth-of-type(11) {
            transform: rotate(300deg);
            color: #FFCC00;
        }
        &:nth-of-type(12) {
            transform: rotate(330deg);
            color: #EDE604;
        }
    }
}
</style>

<template>
    <main>
        <div class="circle">
            <div class="circle-group">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
            </div>
        </div>
    </main>
</template>

<script>
// 渐变圆环
export default {}
</script>
