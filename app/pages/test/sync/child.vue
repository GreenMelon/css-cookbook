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
            :z.sync="y"
            :on-close="close">
        </grand-child>
    </div>
</template>

<script>
    import Vue from 'vue';
    import './grand-child';

    const Child = Vue.extend({
        props: {
            x: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {}
        },
        computed: {
            y: {
                get() {
                    return this.x;
                },
                set(val) {
                    this.$emit('update:x', val);
                }
            }
        },
        methods: {
            close(val) {
                console.log(111, val);
            }
        },
        mounted() {
        }
    });

    Vue.component('child', Child);

    export default Child;
</script>
