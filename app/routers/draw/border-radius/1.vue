<style lang="less" scoped>
    div {
        margin: 10px auto;
    }

    .circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: red;
    }

    .half-circle.top {
        width: 100px;
        height: 50px;
        border-radius: 50px 50px 0 0;
        background-color: red;
    }

    .oval {
        width: 100px;
        height: 50px;
        border-radius: 50px ~"/" 25px;
        background-color: red;
    }

    .half-oval.top {
        width: 100px;
        height: 25px;
        border-radius: 50% ~"/" 100% 100% 0 0;
        background-color: red;
    }

    .half-oval.left {
        width: 100px;
        height: 50px;
        border-radius: 100% 0 0 100% ~"/" 50%;
        background-color: red;
    }

    .half-oval.quarter {
        width: 100px;
        height: 50px;
        border-radius: 100% 0 0 0;
        background-color: red;
    }

    .capsule {
        width: 100px;
        height: 50px;
        border-radius: 50% ~"/" 100%;
        background-color: red;
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <ul>
            <li>
                <div class="circle"></div>
                <pre class="pre-code">
                    <code>
                        .circle {
                            width: 100px;
                            height: 100px;
                            border-radius: 50%;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="half-circle top"></div>
                <pre class="pre-code">
                    <code>
                        .half-circle.top {
                            width: 100px;
                            height: 50px;
                            border-radius: 50px 50px 0 0;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="oval"></div>
                <pre class="pre-code">
                    <code>
                        .oval {
                            width: 100px;
                            height: 50px;
                            border-radius: 50px / 25px;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="half-oval top"></div>
                <pre class="pre-code">
                    <code>
                        .half-oval.top {
                            width: 100px;
                            height: 25px;
                            border-radius: 50% / 100% 100% 0 0;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="half-oval left"></div>
                <pre class="pre-code">
                    <code>
                        .half-oval.left {
                            width: 100px;
                            height: 50px;
                            border-radius: 100% 0 0 100% / 50%;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="half-oval quarter"></div>
                <pre class="pre-code">
                    <code>
                        .half-oval.quarter {
                            width: 100px;
                            height: 50px;
                            border-radius: 100% 0 0 0;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="capsule"></div>
                <pre class="pre-code">
                    <code>
                        .capsule {
                            width: 100px;
                            height: 50px;
                            border-radius: 50% / 100%;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
        </ul>
    </main>
</template>

<script>
    module.exports = {}
</script>
