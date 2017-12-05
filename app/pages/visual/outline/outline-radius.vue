<style lang="less" scoped>
    div {
        margin: 10px auto;
    }

    .outline {
        width: 100px;
        height: 100px;
        border: 10px solid crimson;
        border-radius: 50%;
        outline: 5px dashed black;
        -moz-outline-radius: 50%;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="outline"></div>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>