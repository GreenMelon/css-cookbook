<style lang="less" scoped>
.container {
    display: inline-block;
    cursor: pointer;
}

.bar {
    display: block;
    margin: 10px auto;
    width: 50px;
    height: 5px;
    background: black;
    transition: all .7s ease;
    &.center {
        margin: 0 auto;
    }
}

.container:hover {
    .top {
        transform: translateY(15px) rotateZ(45deg);
    }
    .center {
        width: 0;
    }
    .bottom {
        transform: translateY(-15px) rotateZ(-45deg);
    }
}
</style>

<template>
    <main>
        <div class="container">
            <div class="bar top"></div>
            <div class="bar center"></div>
            <div class="bar bottom"></div>
        </div>
    </main>
</template>

<script>
export default {}
</script>
