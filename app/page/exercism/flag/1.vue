<style lang="less" scoped>
    @import '../../../less/base/variable.less';
    a {
        display: none;
    }

    .flag.border {
        margin: 10px auto;
        width: 200px;
        height: 150px;
        border-right: 10px solid @red;
        background-color: @blue;
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <a href="http://www.cnblogs.com/coco1s/p/5893921.html">draw</a>
        <div class="flag border"></div>
        <ul></ul>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                list: [
                    {name: 'ps画图'},
                    {name: '背景色+边框'},
                    {name: '两个元素+背景色'},
                    {name: '伪元素'},
                    {name: '阴影'},
                    {name: '内阴影'},
                    {name: '滤镜 drop-shadow'},
                    {name: '渐变 linear-gradient'},
                    {name: '轮廓 outline'},
                    {name: '滚动条'},
                    {name: 'canvas'},
                    {name: 'svg'},
                    {name: 'clip'},
                    {name: 'clip-path'},
                ]
            }
        }
    };
</script>
