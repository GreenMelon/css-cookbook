<style lang="less" scoped>
    button {
        -ms-touch-action: manipulation;
            touch-action: manipulation;
    }
</style>

<template>
    <main>
        <h1>touch-action 触控效果的设置</h1>
        <ul>
            <li>auto 默认值，允许浏览器给元素添加touch行为</li>
            <li>none 不允许默认的touch行为</li>
            <li>pan-x 允许水平轴触摸驱动的平移</li>
            <li>pan-y 允许垂直轴触摸驱动的平移</li>
            <li>pinch-zoom 允许拖拽缩放</li>
            <li>manipulation 允许触摸驱动的平移和拖拽缩放</li>
            <li>double-tap-zoom 允许整个页面双击缩放指定元素</li>
            <li>inherit 继承父元素的值</li>
        </ul>
        <button>submit</button>
    </main>
</template>

<script>
export default {}
</script>
