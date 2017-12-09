<style lang="less" scoped>
    .envelope {
        position: relative;
        width: 200px;
        height: 200px;
        margin: 30px auto;
    }
    .envelope::before {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        width: 220px;
        height: 220px;
        background-image: repeating-linear-gradient(
            -45deg,
            #cc2a2d, #cc2a2d 30px,
            #f2f2f2 30px,
            #f2f2f2 40px,
            #0e71bb 40px,
            #0e71bb 70px,
            #f2f2f2 70px,
            #f2f2f2 80px
        );
    }
    .envelope::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="envelope"></div>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>
