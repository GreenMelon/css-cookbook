<style lang="less" scoped>
    input:user-invalid {
        border: 1px solid red;
    }
    input:invalid {
        border: 1px solid fade(red, 90%);
    }
</style>

<template>
    <main>
        <input
            type="text"
            required
        >

        <input
            type="number"
            value="10"
            min="0"
            max="9"
        >
    </main>
</template>

<script>
    export default {};
</script>
