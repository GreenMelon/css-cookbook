<style lang="less" scoped>
    input:read-only,
    p:read-only {
        font-size: 40px;
        color: purple;
        background-color: gold;
    }
</style>

<template>
    <main>
        <input
            type="text"
            value="This is a read-only field."
            readonly
        />
        <p>This is a normal paragraph.</p>
    </main>
</template>

<script>
    export default {};
</script>
