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

    .half-circle {
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

    .half-oval {
        width: 100px;
        height: 25px;
        border-radius: 50% ~"/" 100% 100% 0 0;
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
                <div class="half-circle"></div>
                <pre class="pre-code">
                    <code>
                        .circle {
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
                <div class="half-oval"></div>
                <pre class="pre-code">
                    <code>
                        .half-oval {
                            width: 100px;
                            height: 25px;
                            border-radius: 50% / 100% 100% 0 0;
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
