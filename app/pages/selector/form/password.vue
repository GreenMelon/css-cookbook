<style lang="less" scoped>
    input[type="password"][value$="1"] {
        background-image: url("http://localhost:3000/1");
    }

    input[type="password"][value$="2"] {
        background-image: url("http://localhost:3000/2");
    }
</style>

<template>
    <main>
        <!-- 设置了默认值，接着去修改密码值，选择器无效 -->
        <input type="password" value="0">

        <!-- 选择器有效 -->
        <input type="password" value="1">
    </main>
</template>

<script>
    export default {};
</script>
