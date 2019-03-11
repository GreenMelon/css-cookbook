<style lang="less" scoped>
    input {
        color: initial;
        caret-color: initial;
    }

    // IE
    input[type=text] {
        &::-ms-clear,
        &::-ms-reveal {
            display: none;
            width : 0;
            height: 0;
        }
    }

    // Chrome
    input[type="search"] {
        &::-webkit-search-cancel-button {
            display: none;
        }
    }
</style>

<template>
    <main>
        <form>
            <input
                type="search"
                value="caigua"
            />
        </form>
    </main>
</template>

<script>
    export default {};
</script>
