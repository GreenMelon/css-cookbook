<style lang="less" scoped>
.container {
    width: 230px;
    height: 230px;
    background-image: url(~images/superman.jpg);
    background-size: contain;
    filter: alpha(opacity=50); /* internet explorer */
    -khtml-opacity: 0.5;       /* khtml, old safari */
    -moz-opacity: 0.5;         /* mozilla, netscape */
    opacity: 0.5;              /* fx, safari, opera */
}
</style>

<template>
    <main>
        <div class="container"></div>
    </main>
</template>

<script>
export default {}
</script>
