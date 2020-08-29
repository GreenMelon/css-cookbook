<style lang="less" scoped>
@color-red: #C7254E;

.pie {
    margin: 30px auto;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #007dd4;
    background-image: linear-gradient(to right, transparent 50%, @color-red 0);
    &::before {
        content: '';
        display: block;
        height: 100%;
        margin-left: 50%;
        border-radius: ~"0 100% 100% 0 / 50%";
        transform-origin: left;
        transform-origin: 0 50%;
    }
}
/* DEG: [0, 180]; */
.pie::before {
    background-color: inherit;
    transform: rotate(120deg);
}
/* DEG: [181, 360]; */
.pie.over-half::before {
    background-color: @color-red;
    transform: rotate(.1turn);
}
</style>

<template>
    <main>
        <div class="pie"></div>
        <div class="pie over-half"></div>
    </main>
</template>

<script>
export default {}
</script>
