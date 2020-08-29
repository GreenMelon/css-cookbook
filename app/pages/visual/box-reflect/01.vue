<style lang="less" scoped>
    .box-reflect {
        margin: 20px auto;
        width: 200px;
        height: 200px;
        background-image: url(~images/superman.jpg);
        background-size: contain;
    }
    .above {
        -webkit-box-reflect: above;
    }
    .right {
        -webkit-box-reflect: right;
    }
    .below {
        -webkit-box-reflect: below;
    }
    .left {
        -webkit-box-reflect: left;
    }

    .inherit {
        position: relative;
        margin-top: 220px;
        &::before {
            content: "";
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            bottom: -100%;
            background: inherit;
            transform: rotateX(180deg);
        }
    }
</style>

<template>
    <main>
        <!-- <div class='box-reflect above'></div> -->
        <!-- <div class='box-reflect right'></div> -->
        <div class='box-reflect below'></div>
        <!-- <div class='box-reflect left'></div> -->
        <div class='box-reflect inherit'></div>
    </main>
</template>

<script>
export default {}
</script>
