<style lang="less" scoped>
@color: #007dd4;

main {
    display: flex;
    justify-content: center;
}

.demo {
    margin: 0 20px;
    width: 200px;
    height: 200px;
    border: 2px solid black;
}

.top {
    box-shadow: 0px -20px 10px -10px @color;
}
.right {
    box-shadow: 20px 0px 10px -10px @color;
}
.bottom {
    box-shadow: 0px 20px 10px -10px @color;
}
.left {
    box-shadow: -20px 0px 10px -10px @color;
}
</style>

<template>
    <main>
        <div class="demo top"></div>
        <div class="demo right"></div>
        <div class="demo bottom"></div>
        <div class="demo left"></div>
    </main>
</template>

<script>
export default {}
</script>
