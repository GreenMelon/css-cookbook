<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
}

.bulb {
    display: inline-block;
}

.bulb-area1,
.bulb-area2 {
    transition: 0.6s;
}
.bulb-area1 {
    margin: 0 auto;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: #807d7d;
}
.bulb-area2 {
    position: relative;
    margin: -12px auto 0 auto;
    width: 142px;
    height: 0;
    border-top: 40px solid #807d7d;
    border-right: 16px solid transparent;
    border-left: 16px solid transparent;
    &::before {
        content: "";
        position: absolute;
        left: -47px;
        margin: -93px auto 0 auto;
        width: 172px;
        height: 0;
        border-top: 54px solid #807d7d;
        border-right: 32px solid transparent;
        border-left: 32px solid transparent;
        transition: 0.6s;
    }
    &::after {
        content: "";
        position: absolute;
        top: 0px;
        left: -1px;
        margin: -4px auto 0 auto;
        width: 144px;
        height: 55px;
        padding: 0;
        border-radius: 0 0 900px 900px;
        background: #728b4b; 
    }
}

.bulb-neck1 {
    position: relative;
    margin: 32px auto 0;
    width: 120px;
    height: 12px;
    padding: 14px 0;
    background: #807d7d;
    &::before,
    &::after {
        content: "";
        position: absolute;
        top: 0px;
        left: 0;
        width: 120px;
        height: 16px;
        padding: 0;
        background: #694b8b;
    }
    &::after {
        top: auto;
        bottom: 0px;
    }
}
.bulb-neck2 {
    position: relative;
    margin: -1px auto 0px;
    width: 75px;
    height: 0;
    padding: 0;
    border-top: 25px solid #728b4b;
    border-right: 25px solid transparent;
    border-left: 25px solid transparent;
    border-radius: 8px;
    &::after {
        content: "";
        position: relative;
        top: 20px;
        left: 0;
        margin: 0 auto;
        width: 25px;
        height: 0;
        padding: 0;
        border-top: 20px solid #333;
        border-right: 36px solid transparent;
        border-left: 36px solid transparent;
    }
}

.bulb:hover {
    .bulb-area1 {
        background: #eaec68;
        box-shadow: 0 0 55px 25px rgba(255, 255, 0, 0.4);
    }
    .bulb-area2,
    .bulb-area2::before {
        border-top-color: #eaec68;
    }
}
</style>

<template>
    <main>
        <div class="bulb">
            <div class="bulb-area1"></div>
            <div class="bulb-area2"></div>
            <div class="bulb-neck1"></div>
            <div class="bulb-neck2"></div>
        </div>
    </main>
</template>

<script>
    export default {}
</script>
