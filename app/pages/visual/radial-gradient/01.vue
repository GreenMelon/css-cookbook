<style lang="less" scoped>
div {
    margin: 10px auto;
}

.chrome {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #999, 0 0 2px #ddd inset;
    background:
        radial-gradient(circle, #4FACF5 0, #2196F3 28%, transparent 28%),
        radial-gradient(circle, #FFFFFF 33%, transparent 33%),
        linear-gradient(-50deg, #FFEB3B 34%, transparent 34%),
        linear-gradient(60deg, #4CAF50 33%, transparent 33%),
        linear-gradient(180deg, #FF756B 0, #F44336 30%, transparent 30%),
        linear-gradient(-120deg, #FFEB3B 40%, transparent 40%),
        linear-gradient(-60deg, #FFEB3B 30%, transparent 30%),
        linear-gradient(0deg, #4CAF50 45%, transparent 45%),
        linear-gradient(60deg, #4CAF50 30%, transparent 30%),
        linear-gradient(120deg, #F44336 50%, transparent 50%),
        linear-gradient(180deg, #F44336 30%, transparent 30%);
}
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="chrome"></div>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>
