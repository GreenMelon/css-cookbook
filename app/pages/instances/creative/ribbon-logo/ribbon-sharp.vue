<style lang="less">
.ribbon-sharp {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .left,
    .right {
        position: absolute;
    }
}
</style>

<template>
    <div
        class="ribbon-sharp"
        :style="{
            width: `${times * size}px`,
            height: `${size}px`,
            backgroundColor: color,
            zIndex: zIndex,
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
