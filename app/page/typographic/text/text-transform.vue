<style lang="less" scoped>
    p{
        font-size: 40px;
        text-align: center;
    }
    .capitalize{
        text-transform: capitalize;
    }
    p.first-letter{
        &::first-letter{
            text-transform: capitalize;
        }
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <p class="capitalize">caigua.chinn@qq.com</p>
            </li>
            <li>
                <p class="first-letter">caigua.chinn@qq.com</p>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>
