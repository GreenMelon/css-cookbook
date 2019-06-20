<style lang="less" scoped>
.parent {
    height: 500px;
    overflow: auto;
    border: 1px solid #ccc;
    background:
        linear-gradient(white 30%, rgba(218, 195, 195, 0)),
        linear-gradient(rgba(51, 51, 51, 0.08), rgba(51, 51, 51, 0));
    background-size: 100% 32px, 100% 16px;
    background-attachment: local, scroll;
    background-color: #fff;
    background-repeat: no-repeat;
}

.child {
    height: 1000px;
    font-size: 96px;
    text-align: center;
}
</style>

<template>
    <main>
        <div class="parent">
            <div class="child">Hello, world</div>
        </div>
    </main>
</template>

<script>
    export default {};
</script>
