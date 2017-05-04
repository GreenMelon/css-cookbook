<style lang="less" scoped>
        p.horizontal-tb {
            height: 50px;
            writing-mode: horizontal-tb;
        }
        p.vertical-lr {
            writing-mode: vertical-lr;
        }
        p.vertical-rl {
            writing-mode: vertical-rl;
        }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <button @click="changeMode('horizontal-tb')" type="button">horizontal-tb</button>
        <button @click="changeMode('vertical-lr')" type="button">vertical-lr</button>
        <button @click="changeMode('vertical-rl')" type="button">vertical-rl</button>
        <p :style="{'writing-mode': mode}">writing-mode 改变文字的书写模式</p>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                mode: ''
            }
        },
        methods: {
            changeMode(mode) {
                this.mode = mode;
            }
        },
        created() {}
    };
</script>
