<style lang="less" scoped>
    div {
        width: 194px;
        height: 363px;
        word-wrap: break-word;
        -webkit-mask-image: url(~images/superman.png);
                mask-image: url(~images/superman.png);
    }
</style>

<template>
    <main>
        <div>
            <span v-for="item in times">superman</span>
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
    };
</script>
