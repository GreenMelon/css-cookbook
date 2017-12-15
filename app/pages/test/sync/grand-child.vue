<style lang="less" scoped>
    .grand-child {
        padding: 20px;
        background-color: #c7254e;
    }
</style>

<template>
    <div class="grand-child" @click="change">
        {{ z }}
    </div>
</template>

<script>
    import Vue from 'vue';

    const GrandChild = Vue.extend({
        props: {
            z: {
                type: Number,
                default: 111
            },
            onClose: {
                type: Function,
                default() {
                    return () => {};
                }
            },
        },
        data() {
            return {}
        },
        methods: {
            change() {
                this.$emit('update:z', this.z + 1);
                this.onClose(1);
            }
        },
        mounted() {}
    });

    Vue.component('grand-child', GrandChild);

    export default GrandChild;
</script>
