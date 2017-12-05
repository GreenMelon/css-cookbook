<style lang="less" scoped>
    p {
        margin: 20px auto;
        width: 400px;
        height: 50px;
        line-height: 50px;
        border: 1px solid crimson;
        text-align: center;
    }
    .first {
        outline: 1px dashed orange;
        outline-offset: 0px;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <p class="first">如果规定了 !DOCTYPE，则 IE8 支持 outline 属性</p>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {};
</script>
