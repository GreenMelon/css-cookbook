<style lang="less" scoped>
    .visibility {
        width: 80px;
        height: 60px;
        visibility: hidden;
        background: #007dd4;
        cursor: pointer;
    }
</style>

<template>
    <main>
        <h1>h1</h1>

        <div
            @click="click"
            class="visibility">
        </div>

        <h2>h2</h2>
    </main>
</template>

<script>
    export default {
        methods: {
            click() {
                alert(1);
            },
        },
    }
</script>
