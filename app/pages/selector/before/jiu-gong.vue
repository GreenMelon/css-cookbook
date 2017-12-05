<style lang="less" scoped>
    div {
        position: relative;
        margin: 20px auto;
        width: 13em;
        height: 13em;
        font-size: 10px;
        border: 1em solid #000;
        &::before,
        &::after {
            content: "";
            position: absolute;
            top: -1em;
            left: 3em;
            width: 3em;
            height: 11em;
            border: inherit;
        }
        &::after {
            transform: rotate(0.25turn);
        }
    }
</style>

<template>
    <main>
        <div></div>
    </main>
</template>

<script>
    export default {};
</script>
