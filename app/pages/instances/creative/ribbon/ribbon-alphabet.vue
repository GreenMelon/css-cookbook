<style lang="less">
.ribbon-alphabet {
    position: relative;
    display: inline-block;
    overflow: hidden;
    outline: 1px dashed #000;
}
</style>

<template>
    <div
        class="ribbon-alphabet"
        :style="{
            width: `${size * (1 + widthTimes + 1)}px`,
            height: `${size * (1 + heightTimes + 1)}px`,
        }"
    >
        <slot />
    </div>
</template>

<script>
    export default {
        name: 'ribbon-alphabet',

        props: {
            size: {
                type: Number,
                default: 12,
            },
            widthTimes: {
                type: Number,
                default: 1,
            },
            heightTimes: {
                type: Number,
                default: 1,
            },
        },
    };
</script>
