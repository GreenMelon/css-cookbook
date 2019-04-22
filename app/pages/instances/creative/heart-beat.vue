<style lang="less" scoped>
.heart {
    display: block;
    margin: 100px auto 0;
    width: 300px;
    height: 300px;
    animation: pound .3s infinite;
}

@keyframes pound {
    from {
        transform: none;
    }
    to {
        transform: scale(1.2);
    }
}
</style>

<template>
    <main>
        <img class="heart" src="~images/heart.svg" alt="">
    </main>
</template>

<script>
    export default {}
</script>
