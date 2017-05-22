<style lang="less" scoped>
    .child {
        height: 100px;
        font-size: 30px;
        color: white;
        background: gray;
    }
</style>

<template>
    <div class="child" @click="change">
        {{ x }}
    </div>
</template>

<script>
    import Vue from 'vue';

    const Child = Vue.extend({
        props: {
            x: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                //
            }
        },
        methods: {
            change() {
                console.log(this.x+1);
                this.$emit('update', this.x + 1);
            }
        },
        mounted() {
            //
        }
    });

    Vue.component('Child', Child);

    export default Child;
</script>
