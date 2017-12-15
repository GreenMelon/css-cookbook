<style lang="less" scoped>
    li {
        text-align: center;
        img,
        span {
            &:first-child{
                filter:drop-shadow(5px 5px 10px black);
            }
            &:last-child{
                box-shadow: 5px 5px 10px black;
            }
        }
    }
    img,
    span {
        margin: 50px;
        display: inline-block;
    }
    span {
        width: 100px;
        height: 100px;
        border: 10px dashed #007dd4;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <img src="~images/superman.jpg" width="200" alt="x">
                <img src="~images/superman.jpg" width="200" alt="x">
            </li>
            <li>
                <span></span>
                <span></span>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {};
</script>
