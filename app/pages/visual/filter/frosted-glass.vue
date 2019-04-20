<style lang="less" scoped>
    .container {
        position: relative;
        width: 230px;
        height: 230px;
        overflow: hidden;
        background-image: url(~images/superman.jpg);
        background-repeat: no-repeat;
        background-size: contain;
    }

    .frosted-glass{
        width: 100%;
        height: 100%;
    	background: inherit;
    	filter: blur(4px);
    	filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false); /*IE6~9*/
    }

    .text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 40px;
        text-transform: uppercase;
        color: #fff;
    }
</style>

<template>
    <main>
        <div class="container">
            <div class="frosted-glass"></div>
            <span class="text">hello</span>
        </div>
    </main>
</template>

<script>
    export default {};
</script>
