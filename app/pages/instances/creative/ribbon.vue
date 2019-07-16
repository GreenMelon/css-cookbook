<style lang="less" scoped>
.ribbon {
    position: absolute;
    .left,
    .right {
        position: absolute;
    }
}
</style>

<template>
    <div
        class="ribbon"
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
        name: 'ribbon',

        props: {
            size: {
                type: Number,
                default: 0,
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
