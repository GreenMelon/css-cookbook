<style lang="less" scoped>
    .hexagon {
        margin: 10px auto;
        width: 205px;
        height: 170px;
        overflow: hidden;
        div {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .content {
            background: url(~images/blue-sky.jpg);
            background-size: cover;
        }

        .inner {
            transform: rotate(60deg);
        }
        .outer {
            transform: rotate(-120deg);
        }
        & {
            transform: rotate(60deg);
        }
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="hexagon">
                    <div class="outer">
                        <div class="inner">
                            <div class="content"></div>
                        </div>
                    </div>
                </div>
                <pre class="pre-code">
                    <code>
                        //
                    </code>
                </pre>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>
