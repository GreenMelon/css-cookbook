<style lang="less" scoped>
    .infinity {
        position: relative;
        margin: 10px auto;
        width: 212px;
        height: 100px;
    }

    .infinity::before,
    .infinity::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 60px;
        height: 60px;
        border: 20px solid red;
        border-radius: 50px 50px 0 50px;
        transform: rotate(-45deg);
    }

    .infinity::after {
        right: 0;
        left: auto;
        border-radius: 50px 50px 50px 0;
        transform: rotate(45deg);
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <div class="infinity"></div>
    </main>
</template>

<script>
    export default {};
</script>
