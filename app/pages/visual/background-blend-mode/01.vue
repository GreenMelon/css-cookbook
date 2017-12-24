<style lang="less" scoped>
    .pic {
        display: inline-block;
        width: 100px;
        height: 100px;
        background-blend-mode: lighten;
        background-size: cover;
        &:first-child {
            background-image: url(~images/telescope.png), linear-gradient(#007dd4, #007dd4);
        }
        &:nth-child(2) {
            background-image: url(~images/telescope.png), linear-gradient(orange, purple);
        }
    }
</style>

<template>
    <main>
        <ul>
            <li class="pic"></li>
            <li class="pic"></li>
        </ul>
    </main>
</template>

<script>
    export default {
        data() {
            return {}
        },
    };
</script>
