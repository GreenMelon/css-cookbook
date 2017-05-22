<style lang="less" scoped>
</style>

<template>
    <main>
        <Child :x="num" @update="(val) => { num = val}"></Child>
    </main>
</template>

<script>
    import './child';

    export default {
        data() {
            return {
                num: 1
            }
        },
        methods: {
            //
        },
        mounted() {
            //
        }
    };
</script>
