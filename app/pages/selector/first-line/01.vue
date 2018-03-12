<style lang="less" scoped>
    p::first-line, span::first-line {
        font-size: 16px;
        color: deeppink;
    }
</style>

<template>
    <main>
        <!-- ::first-line 只对块级元素起作用 -->
        <p>This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.</p>

        <!-- ::first-line 对内联元素不起作用 -->
        <span>This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.This is content.</span>
    </main>
</template>

<script>
    export default {};
</script>