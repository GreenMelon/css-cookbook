<style lang="less" scoped>
    div {
        margin: 10px auto;
    }

    .outer {
        padding: 10px 0;
        background: url("/app/images/blue-sky.jpg");
        background-size: contain;
    }

    .inner {
        width: 100px;
        height: 100px;
        border: 10px solid rgba(255, 255, 255, 0.1);
        background-color: #FFF;
        background-clip: padding-box;
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <ul>
            <li>
                <div class="outer">
                    <div class="inner"></div>
                </div>
                <pre class="pre-code">
                    <code>
                        .inner {
                            width: 100px;
                            height: 100px;
                            border: 10px solid rgba(255, 255, 255, 0.1);
                            background-color: #FFF;
                            background-clip: padding-box;
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
