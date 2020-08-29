<style lang="less" scoped>
    p {
        font-size: 20px;
    }
    [class=val] {
        color: orange;
    }
    [class|=val] {
        color: purple;
    }
    [class~=val] {
        color: deeppink;
    }
    [class*=val] {
        color: gold;
    }
    [class^=val] {
        color: aquamarine;
    }
    [class$=val] {
        color: pink;
    }
</style>

<template>
    <main>
        <h1>属性选择器</h1>

        <pre>
            <code>
                [attr=val]：属性值为val;
                [attr|=val]：属性值为val或者以val-开头;
                [attr~=val]：属性值为val或者以多个空格分开含有val;
                [attr*=val]：属性值包含val;
                [attr^=val]：属性值以val开头;
                [attr$=val]：属性值以val结尾.
            </code>
        </pre>

        <p class="val">class="val"</p>

        <p class="val">class="val"</p>
        <p class="val-">class="val-"</p>
        <p class="val-a">class="val-a"</p>

        <p class="val">class="val"</p>
        <p class="val a">class="val a"</p>
        <p class="val ">class="val "</p>
        <p class="a val">class="a val"</p>

        <p class="val">class="val"</p>
        <p class="value">class="value"</p>
        <p class="a-val-b">class="a-val-b"</p>
        <p class="a-val">class="a-val"</p>

        <p class="val">class="val"</p>
        <p class="value">class="value"</p>

        <p class="val">class="val"</p>
        <p class="a val">class="a val"</p>
        <p class="a-val">class="a-val"</p>
    </main>
</template>

<script>
export default {}
</script>
