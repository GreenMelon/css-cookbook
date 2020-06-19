<style lang="less">
.ribbon-square {
    position: absolute;
}
</style>

<template>
    <div
        class="ribbon-square"
        :style="{
            zIndex: zIndex,
            width: `${size * (1 + times + 1)}px`,
            height: `${size}px`,
            backgroundColor: color,
        }"
    >
    </div>
</template>

<script>
    export default {
        name: 'ribbon-square',

        props: {
            size: {
                type: Number,
                default: 12,
            },
            times: {
                type: Number,
                default: 1,
            },
            color: {
                type: String,
                default: '',
            },
            zIndex: {
                type: Number,
                default: 0,
            },
        }
    };
</script>
