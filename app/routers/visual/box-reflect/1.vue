<style lang="less" scoped>
    .box-reflect {
        margin: 20px auto;
        width: 200px;
        height: 200px;
        background-image: url('../../../image/superman.jpg');
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
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <!-- <div class='box-reflect above'>above</div> -->
        <!-- <div class='box-reflect right'>right</div> -->
        <div class='box-reflect below'>below</div>
        <!-- <div class='box-reflect left'>left</div> -->
    </main>
</template>

<script>
    module.exports = {};
</script>
