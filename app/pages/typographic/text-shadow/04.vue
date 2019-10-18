<style lang="less" scoped>
div {
    position: relative;
    margin: 30vmin auto;
    font-family: Times New Roman, 'serif';
    font-size: 30vmin;
    line-height: 40vmin;
    text-align: center;
    text-shadow: 4px 4px 1px #333;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        background-image: linear-gradient(-45deg, #fff 0%, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent 100%);
        background-size: 6px 6px;
    }
    &::after {
        content: attr(data-name);
        position: absolute;
        top: -4px;
        right: 6px;
        bottom: 6px;
        left: -2px;
        z-index: 2;
        color: #333;
        text-shadow: 3px 3px #fff;
    }
}
</style>

<template>
    <main>
        <div data-name="Solid Shadow Word">Solid Shadow Word</div>
    </main>
</template>

<script>
export default {}
</script>
