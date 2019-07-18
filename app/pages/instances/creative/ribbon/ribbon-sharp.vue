<style lang="less">
.ribbon-sharp {
    position: absolute;
    font-size: 0;
    .left,
    .center,
    .right {
        display: inline-block;
    }
}
</style>

<template>
    <div
        class="ribbon-sharp"
        :style="{
            zIndex: zIndex,
            width: `${(1 + times + 1) * size}px`,
        }"
    >
        <em
            class="left"
            :style="{
                left: `-${size}px`,
                borderLeft: `${size}px solid transparent`,
                borderBottom: `${size}px solid ${color}`,
            }"
        />
        <em
            class="center"
            :style="{
                width: `${times * size}px`,
                height: `${size}px`,
                backgroundColor: color,
            }"
        />
        <em
            class="right"
            :style="{
                right: `-${size}px`,
                borderRight: `${size}px solid transparent`,
                borderBottom: `${size}px solid ${color}`,
            }"
        />
    </div>
</template>

<script>
    export default {
        name: 'ribbon-sharp',

        props: {
            size: {
                type: Number,
                default: 12,
            },
            times: {
                type: Number,
                default: 0,
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
