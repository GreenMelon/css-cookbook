<style lang="less" scoped>
</style>

<template>
    <main>
        <h1>Safari Technology Preview</h1>
        <img :src="src">
    </main>
</template>

<script>
// 用 img 播放 mp4 文件
export default {
    data() {
        return {
            src: 'http://www.caiguazai.com/796795205.mp4',
        }
    },
};
</script>
