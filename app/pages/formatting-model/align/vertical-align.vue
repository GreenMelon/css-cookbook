<style lang="less" scoped>
    div {
        p {
            display: inline-block;
            width: 100px;
            height: 300px;
            background: #007dd4;
            &:first-child {
                vertical-align: -10%;
                vertical-align: -20px;
            }
        }
    }
</style>

<template>
    <main>
        <h1>vertical-align 支持负值和百分比</h1>
        <div>
            <p></p>
            <p></p>
        </div>
    </main>
</template>

<script>
export default {}
</script>
