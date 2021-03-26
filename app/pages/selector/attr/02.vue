<style lang="less" scoped>
.tooltip:focus::after,
.tooltip:hover::after {
    content: attr(aria-label);
    display: block;
}

.tooltip:focus::after,
.tooltip:hover::after {
    position: absolute;
    top: 100%;
    margin-top: 10px;
    width: 240px;
    padding: 10px;
    font-size: 14px;
    text-align: left;
    border-radius: 4px;
    color: initial;
    background-color: #f2f2f2;
}

.tooltip {
    position: relative;
    display: inline-block;
    color: goldenrod;
}

.tooltip:hover::before {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    display: block;
    width: 0;
    height: 0;
    border: solid transparent;
    border-width: 6px;
    border-bottom-color: #f2f2f2;
    pointer-events: none;
}

</style>

<template>
    <main>
        <div>
            This is an example of a <a href="javascript:void(0);" class="tooltip" aria-label="The tooltip or a hint is a common GUI element that describes the item it's related to.">Tooltip</a>. Click on it to learn more.
        </div>
    </main>
</template>

<script>
export default {
    alias: 'tooltip',
}
</script>
