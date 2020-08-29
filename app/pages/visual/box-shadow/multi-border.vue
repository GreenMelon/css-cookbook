<style lang="less" scoped>
    @import '../../../less/base/variable.less';

    div {
        margin: 10px auto;
    }
    pre {
        margin-top: 30px;
    }

    .track {
        width: 100px;
        height: 100px;
        border: 10px solid @red;
        border-radius: 50%;
        box-shadow:
            0 0 0 10px @green,
            0 0 0 20px @blue,
            0 0 0 10px @black inset;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="track"></div>
                <pre class="pre-code">
                    <code>
                        .track {
                            width: 100px;
                            height: 100px;
                            border: 10px solid @red;
                            border-radius: 50%;
                            box-shadow:
                                0 0 0 10px @green,
                                0 0 0 20px @blue,
                                0 0 0 10px @black inset;
                        }
                    </code>
                </pre>
            </li>
        </ul>
    </main>
</template>

<script>
export default {}
</script>
