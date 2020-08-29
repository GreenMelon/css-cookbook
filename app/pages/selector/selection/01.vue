<style lang="less" scoped>
    // 可用属性
    // ::selection {
    //     text-shadow: 1px 1px 0 green;
    //     color: purple;
    //     background-color: yellow;

    //     text-decoration: underline;
    //     text-emphasis-color: red;
    //     outline: 1px solid #000;
    //     cursor: help;
    // }

    // 选中样式
    ::-moz-selection {
        text-shadow: 2px 2px 0 green;
        color: purple;
        background-color: gold;
    }
    ::selection {
        text-shadow: 2px 2px 0 green;
        color: purple;
        background-color: gold;
    }

    // 不选中
    // ::-moz-selection {
    //     color: inherit;
    //     background-color: inherit;
    // }
    // ::selection {
    //     color: inherit;
    //     background-color: inherit;
    // }

    // 完全选不中
    // p {
    //     user-select: none;
    // }

    p {
        font-size: 80px;
        text-align: center;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <p>CSS3 ::selection Selector.</p>
            </li>
        </ul>
    </main>
</template>

<script>
export default {}
</script>
