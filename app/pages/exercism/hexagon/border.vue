<style lang="less" scoped>
    @color: #007DD4;

    .hexagon {
        position: relative;
        margin: 80px auto;
        width: 10em;
        height: 6em;
        font-size: 20px;
        background-color: @color;
        &::before,
        &::after {
            content: "";
            position: absolute;
            border-right: 5em solid transparent;
            border-left: 5em solid transparent;
        }
        &::before {
            top: -3em;
            border-bottom: 3em solid @color;
        }
        &::after {
            bottom: -3em;
            border-top: 3em solid @color;
        }
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="hexagon"></div>
                <pre class="pre-code">
                    <code>
                        .hexagon {
                            position: relative;
                            margin: 80px auto;
                            width: 10em;
                            height: 6em;
                            font-size: 20px;
                            background-color: @color;
                            &::before,
                            &::after {
                                content: "";
                                position: absolute;
                                border-right: 5em solid transparent;
                                border-left: 5em solid transparent;
                            }
                            &::before {
                                top: -3em;
                                border-bottom: 3em solid @color;
                            }
                            &::after {
                                bottom: -3em;
                                border-top: 3em solid @color;
                            }
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
