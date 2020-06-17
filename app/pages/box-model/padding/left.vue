<style lang="less" scoped>
.parent {
    box-sizing: border-box; 
    width: 500px;
    height: 100px;
    line-height: 100px;
    font-family: Georgia, serif;
    font-size: 20px;
    color: #fff;
    background-color: #c7254e;
}
.parent:nth-of-type(2) {
    border-left: 50px solid #009688;
    background-color: #007dd4;
}
.child {
    padding-left: 10%;
}
</style>

<template>
    <main>
        <h1>padding-left 单位为百分比时, 相对的是父元素的 content-width</h1>

        <div class="parent">
            <div class="child">
                padding-left: (500px) * 10% = 50px; 
            </div>
        </div>

        <div class="parent">
            <div class="child">
                padding-left: (500px - 50px) * 10% = 45px;
            </div>
        </div>
    </main>
</template>

<script>
// padding-left 百分比
export default {}
</script>
