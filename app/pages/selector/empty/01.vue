<style lang="less" scoped>
    li {
        margin-top: 10px;
    }
    p {
        height: 30px;
        line-height: 30px;
        background: #007dd4;
    }
    p:empty {
        background: #c7254e;
    }
    p:empty::before {
        content: "我是虚拟的placeholder"
    }
    p:not(:empty):focus::before {
        content: ""
    }
    .contenteditable {
        padding-left: 10px;
        outline: none;
        cursor: text;
    }
</style>

<template>
    <main>
        <h1>:empty 选择器匹配没有子元素(包括文本节点)的每个元素</h1>
        <ul>
            <li>
                <p>
                    <span>子元素</span>
                </p>
            </li>
            <li>
                <p>文本节点</p>
            </li>
            <li>
                <p contenteditable="true" class="contenteditable"></p>
            </li>
        </ul>
    </main>
</template>

<script>
export default {}
</script>
