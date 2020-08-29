<style lang="less" scoped>
    div {
        margin: 30px auto;
    }

    .outline-1 {
        width: 100px;
        height: 100px;
        border: 10px solid crimson;
        border-radius: 50%;
        outline: 5px dashed black;
        outline-offset: -30px;
        outline-offset: 10px;
    }

    .outline-2 {
        width: 200px;
        height: 150px;
        padding: 10px;
        border: 15px solid crimson;
        background-color: purple;
        outline: 5px solid yellow;
        outline-offset: -10px;
        outline-offset: -15px;
        outline-offset: -20px;
        outline-offset: -60px;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="outline-1"></div>
            </li>
            <li>
                <div class="outline-2"></div>
            </li>
        </ul>
    </main>
</template>

<script>
export default {}
</script>