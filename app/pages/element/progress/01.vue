<style lang="less" scoped>
    #progress {
        border: 2px solid crimson;
        border-radius: 8px;
        background: orange;
        /* Chrome 全部长度 */
        &::-webkit-progress-bar {
            // border-radius: 4px;
            background: transparent;
        }
        /* Chrome 已完成长度 */
        &::-webkit-progress-value {
            border-radius: 6px;
            background: salmon;
        }
        &::-webkit-progress-inner-element {
            border-radius: 4px;
        }
    }

    /* Firefox 已完成长度 */
    progress::-moz-progress-bar {
        background: teal;
    }
</style>

<template>
    <main id="main">
        <ul>
            <li>
                <h2>默认动画</h2>
                <progress />
            </li>
            <li>
                <h2>max && value</h2>
                <progress
                    id="progress"
                    value="50"
                    max="100">
                </progress>
            </li>
        </ul>
    </main>
</template>

<script>
export default {
    mounted() {
        this.getProgressPosition();
        this.getProgressLabels();
    },
    methods: {
        getProgressPosition() {
            const { position } = progress;
            console.log({ position }); // 50 / 100 === 0.5. 如果没有确定的 value, 那么 position 就是 1
        },
        getProgressLabels() {
            const { labels } = progress;
            console.log(labels);
        },
    },
}
</script>
