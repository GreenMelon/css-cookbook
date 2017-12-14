<style lang="less" scoped>
    .parent {
        padding: 20px;
        background-color: #7fffd4;
    }
</style>

<template>
    <main>
        <div class="parent">
            <child
                ref="child"
                :x.sync="num">
            </child>
        </div>
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
        methods: {},
        mounted() {}
    };
</script>
