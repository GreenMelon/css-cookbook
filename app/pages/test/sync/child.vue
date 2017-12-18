<style lang="less" scoped>
    .child {
        padding: 20px;
        font-size: 30px;
        color: white;
        background: #007dd4;
    }
</style>

<template>
    <div class="child">
        <grand-child
            :z.sync="X"
            :on-close="close">
        </grand-child>
        <input
            v-model="Y"
            v-focus="{
                a: '111'
            }"
            type="text"
        >
    </div>
</template>

<script>
    import Vue from 'vue';
    import Filters from '@/filters/index';
    import './grand-child';

    const Child = Vue.extend({
        props: {
            x: {
                type: Number,
                default: 0,
            },
            y: {
                type: String,
                default: '',
            },
            subfix: {
                type: String,
                default: '',
            },
        },
        data() {
            return {}
        },
        computed: {
            X: {
                get() {
                    return this.x;
                },
                set(val) {
                    this.$emit('update:x', val);
                }
            },
            Y: {
                get() {
                    return Filters.subfix(this.y, this.subfix);
                },
                set(val) {
                    this.$emit('update:y', val.replace(this.subfix, ''));
                }
            },
        },
        methods: {
            close(val) {
                console.log(111, val);
            },
        },
        mounted() {
        },
    });

    Vue.component('child', Child);

    export default Child;
</script>
