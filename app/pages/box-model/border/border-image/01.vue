<style lang="less" scoped>
div {
    margin: 30px auto;
    width: 300px;
    padding: 10px 20px;
    border: 15px solid transparent;
    font-size: 20px;
    text-align: center;
    border-image: url("~images/border.png") 30 30;
}
.round {
    border-image-repeat: round;
}
.stretch {
    border-image-repeat: stretch;
}
</style>

<template>
    <main>
        <div class="round">round</div>
        <div class="stretch">stretch</div>
    </main>
</template>

<script>
export default {}
</script>
