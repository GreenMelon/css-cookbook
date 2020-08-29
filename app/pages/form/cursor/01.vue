<style lang="less" scoped>
    input,
    textarea,
    [contenteditable] {
        color: red !important;     /* 光标的颜色*/
        text-shadow: 0 0 0 green;  /* 文本的颜色 */
        -webkit-text-fill-color: transparent;
        &::-webkit-input-placeholder {
            color: red !important;     /* 光标的颜色*/
            text-shadow: none;
            -webkit-text-fill-color: initial;
        }
    }

    //
    @supports (caret-color: red) {
        input,
        textarea,
        [contenteditable] {
            color: green;      /* 文本颜色 */
            caret-color: red;  /* 光标颜色 */
            &::-webkit-input-placeholder {
                color: inherit;
                caret-color: inherit;
            }
        }
    }
</style>

<template>
    <main>
        <form>
            <input placeholder="请输入" />
        </form>
    </main>
</template>

<script>
export default {}
</script>
