<style lang="less" scoped>
    .outer {
        position: relative;
        height: 5em;
        font-size: 20px;
    }
    .clip {
        position: absolute;
        clip: rect(1em, 4em, 2.5em, .5em);
        width: 5em;
        height: 4em;
        line-height: 4em;
        background-color: #007DD4;
        cursor: pointer;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="outer">
                    <div class="clip">背景裁切</div>
                </div>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>
