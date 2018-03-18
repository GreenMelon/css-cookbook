<style lang="less" scoped>
    option:default {
        font-size: 16px;
        background-color: red;
    }
    input:default + label::after {
        content: "(推荐)";
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
            <div>
                <p>
                    <input type="radio" name="option" id="radio-1">
                    <label for="radio-1">选项1</label>
                </p>
                <p>
                    <input type="radio" name="option" id="radio-2" checked>
                    <label for="radio-2">选项2</label>
                </p>
                <p>
                    <input type="radio" name="option" id="radio-3">
                    <label for="radio-3">选项3</label>
                </p>
            </div>
        </form>
    </main>
</template>

<script>
    export default {};
</script>
