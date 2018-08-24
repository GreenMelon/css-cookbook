<style lang="less" scoped>
    input:read-write,
    p:read-write {
        font-size: 40px;
        color: purple;
        background-color: gold;
    }
</style>

<template>
    <main>
        <input
            type="text"
            value="Type whatever you want here."
        />
        <p contenteditable>You can edit this paragraph!</p>
    </main>
</template>

<script>
    export default {};
</script>
