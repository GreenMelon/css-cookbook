<style lang="less" scoped>
    option:default {
        font-size: 16px;
        background-color: red;
    }
</style>

<template>
    <main>
        <form>
            <select multiple>
                <option value="1">1</option>
                <option value="2" selected>2</option>
                <option value="3">3</option>
            </select>
        </form>
    </main>
</template>

<script>
    export default {};
</script>
