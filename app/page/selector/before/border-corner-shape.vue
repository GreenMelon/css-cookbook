<style lang="less" scoped>
    .border-radius-inner {
        position: relative;
        margin: 50px auto;
        width: 200px;
        height: 200px;
        overflow: hidden;
        background-color: #007dd4;
        i {
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #fff;
            &:first-child,
            &:nth-child(2) {
                top: -15px;
            }
            &:first-child,
            &:nth-child(3) {
                left: -15px;
            }
            &:last-child,
            &:nth-child(2) {
                right: -15px;
            }
            &:last-child,
            &:nth-child(3) {
                bottom: -15px;
            }
        }
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <div class="border-radius-inner">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
        </div>
        <h1><a href="http://docs.webplatform.org/css/properties/border-corner-shape/">border-corner-shape: curve | bevel | notch | scoop</a></h1>
        <ul>
            <li>curve: 默认值，圆角</li>
            <li>bevel: 切角，其实就是沿与相交线的垂直线切割掉直角</li>
            <li>notch: 凹槽</li>
            <li>scoop: 向内凹的圆角</li>
        </ul>
    </main>
</template>

<script>
    module.exports = {};
</script>
