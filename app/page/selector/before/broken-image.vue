<style lang="less" scoped>
    li {
        padding: 20px 0;
    }
    img {
        width: 160px;
        height: 100px;
    }
    .broken-image {
        position: relative;
        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ccc;
        }
        &::after {
            content: ":( Broken Image of " attr(alt);
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);

            width: 100%;
            max-height: 100%;
            overflow: hidden;
            font-size: 14px;
            line-height: 1.2;
            text-align: center;
            color: #fff;
        }
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <ul>
            <li>
                <img src="/app/images/blue-sky.jpg" alt="banner">
            </li>
            <li>
                <img src="https://caigua.com/image/blue-sky.jpg" alt="banner">
            </li>
            <li>
                <img class="broken-image" src="https://caigua.com/image/blue-sky.jpg" alt="banner">
            </li>
        </ul>
    </main>
</template>

<script>
    export default {};
</script>
