<style scoped>
img {
    width: 200px;
    height: auto;
}
</style>

<template>
    <main>
        <h1>Index</h1>

        <img :src="preview1" alt="">
        <img :src="preview2" alt="">
        <img src="~images/blue-sky.jpg" alt="">

    </main>
</template>

<script>
import preview2 from '@/images/blue-sky.jpg';

export default {
    data() {
        return {
            preview1: require('../images/blue-sky.jpg'),
            preview2: preview2,
        }
    },
}
</script>
