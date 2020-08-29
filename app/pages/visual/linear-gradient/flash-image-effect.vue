<style lang="less" scoped>
    .container {
        position: relative;
        display: inline-block;
        overflow: hidden;
        cursor: pointer;
        &:hover .light {
		    left: 100%;
		    transition: left 1s;
		}
    }

    .image {
        width: 600px;
    }

    .light {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background-image: -webkit-linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
        transform: skewx(-25deg);
    }
</style>

<template>
    <main>
        <p class="container">
            <img class="image" src="~images/blue-sky.jpg">
            <i class="light"></i>
        </p>
    </main>
</template>

<script>
export default {}
</script>
