<style lang="less" scoped>
img {
    width: 400px;
    -webkit-mask: url(~assets/icon-smile.png) center no-repeat;
    -webkit-mask-size: 170px;
}
</style>

<template>
    <main>
        <div>
            <img src="~images/blue-sky.jpg" alt="">
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            times: 100,
        }
    },
}
</script>
