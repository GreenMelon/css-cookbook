<style lang="less" scoped>
    li {
        margin-bottom: 10px;
    }
    p {
        width: 100px;
        border: 1px solid #000;
    }
    .normal {
        overflow-wrap: normal;
    }
    .break-word {
        overflow-wrap: break-word;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <b>normal</b>
                <p class="normal">abbcccddddeeeeeffffffggggggg</p>
            </li>
            <li>
                <b>break-word</b>
                <p class="break-word">abbcccddddeeeeeffffffggggggg</p>
            </li>
            <li>
                <b>break-word</b>
                <p class="break-word">图文混排abbcccddddeeeeeffffffggggggg</p>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>
