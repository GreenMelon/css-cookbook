<style lang="less" scoped>
    .auto {
        width: 350px;
        table-layout: auto;
    }
    .fixed {
        width: 350px;
        table-layout: fixed;
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <ul>
            <li>
                <h1>auto: 表格自动算法</h1>
                <table class="auto" border="1">
                    <tbody>
                        <tr>
                            <td>宽度将基于单元格的内容自动拉伸</td>
                            <td>表格自动算法</td>
                            <td>表格自动算法</td>
                        </tr>
                        <tr>
                            <td>表格自动算法</td>
                            <td>表格自动算法</td>
                            <td>表格自动算法</td>
                        </tr>
                    </tbody>
                </table>

                <h1>fixed: 表格固定算法</h1>
                <table class="fixed" border="1">
                    <tbody>
                        <tr>
                            <td>宽度固定</td>
                            <td>表格固定算法</td>
                            <td>表格固定算法</td>
                        </tr>
                        <tr>
                            <td>表格固定算法</td>
                            <td>表格固定算法</td>
                            <td>表格固定算法</td>
                        </tr>
                    </tbody>
                </table>

                <pre class="pre-code">
                    <code>
auto：默认的自动算法。布局将基于各单元格的内容。换言之，可能你给某个单元格定义宽度为100px，但结果可能并不是100px。表格在每一单元格读取计算之后才会显示出来，速度很慢。

fixed：固定布局的算法。在这算法中，水平布局是仅仅基于表格的宽度，表格边框的宽度，单元格间距，列的宽度，而和表格内容无关。也就是说，内容可能被裁切。
                    </code>
                </pre>
            </li>
        </ul>
    </main>
</template>

<script>
    module.exports = {}
</script>
