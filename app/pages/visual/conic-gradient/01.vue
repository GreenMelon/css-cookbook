<style lang="less" scoped>
    [class|="demo"] {
        margin: 10px auto;
        width: 200px;
        height: 200px;
    }
    .demo-1 {
        background: conic-gradient(purple, orange);
    }
    .demo-2 {
        border-radius: 50%;
        background: conic-gradient(red, orange, yellow, green, teal, blue, purple);
    }
    .demo-3 {
        border-radius: 50%;
        /* 第一种写法 */
        background: conic-gradient(red 0, red 30%, green 30%, green 70%, blue 70%, blue);
        /* 第二种写法 */
        background: conic-gradient(red 0 30%, green 30% 70%, blue 70% 100%);
    }
    .demo-4 {
        background: conic-gradient(black 0 12.5%, white 0, 37.5%, black 0 62.5%, white 0 87.5%, black 0);
        background-size: 40px 40px;
    }
    .demo-5 {
        background: repeating-conic-gradient(red 0 15deg, white 0 30deg);
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <h1>basic example</h1>
                <div class="demo-1"></div>
            </li>
            <li>
                <h1>颜色表盘</h1>
                <div class="demo-2"></div>
            </li>
            <li>
                <h1>pie</h1>
                <div class="demo-3"></div>
            </li>
            <li>
                <h1>配合background-size</h1>
                <div class="demo-4"></div>
            </li>
            <li>
                <h1>重复圆锥渐变</h1>
                <div class="demo-5"></div>
            </li>
        </ul>
    </main>
</template>

<script>
export default {
    data() {
        return {
            url: 'http://www.cnblogs.com/coco1s/p/7079529.html'
        }
    }
}
</script>
