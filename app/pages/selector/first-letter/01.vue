<style lang="less" scoped>
    p::first-letter, span::first-letter {
        font-size: 16px;
        text-transform: uppercase;
        color: deeppink;
    }
</style>

<template>
    <main>
        <!-- ::first-letter 只对块级元素起作用 -->
        <p>this is content.</p>

        <!-- ::first-letter 对内联元素不起作用 -->
        <span>this is content.</span>
    </main>
</template>

<script>
export default {}
</script>