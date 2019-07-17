<style lang="less">
.ribbon-alphabet-g {
    .ribbon-sharp {
        &:nth-child(2) {
            transform: translate(-50%, -50%) rotate(-90deg);
        }
        &:nth-child(3) {
            transform: translate(-50%, -50%) rotate(180deg);
        }
        &:nth-child(4) {
            transform: translate(-50%, -50%) rotate(90deg);
        }
    }
}
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-g"
    >
        <ribbon-sharp
            :size="size"
            :times="widthTimes"
            color="#e91a8c"
            :style="{
                marginTop: `-${halfHeight - halfSize}px`,
            }"
        />
        <ribbon-sharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            color="#7f00ff"
            :style="{
                marginLeft: `-${halfWidth - halfSize}px`,
            }"
        />
        <ribbon-sharp
            :size="size"
            :times="widthTimes"
            color="#411ad6"
            :style="{
                marginTop: `${halfHeight - halfSize}px`,
            }"
        />
        <ribbon-sharp
            :size="size"
            :times="heightTimes / 2"
            :z-index="1"
            color="#ff7f00"
            :style="{
                marginTop: `${halfHeight - halfWidth}px`,
                marginLeft: `${halfWidth - halfSize}px`,
            }"
        />
        <ribbon-sharp
            :size="size"
            :times="widthTimes / 2"
            color="#5ceaa2"
            :style="{
                marginTop: `-${halfSize}px`,
                marginLeft: `${(halfWidth) / 2 - halfSize}px`,
            }"
        />
    </RibbonAlphabet>
</template>

<script>
    import RibbonAlphabet from '../ribbon-alphabet';
    import RibbonSharp from '../ribbon-sharp';

    export default {
        name: 'ribbon-g',

        components: {
            RibbonAlphabet,
            RibbonSharp,
        },

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

        computed: {
            halfWidth() {
                return (1 + this.widthTimes + 1) * this.size / 2;
            },
            halfHeight() {
                return (1 + this.heightTimes + 1) * this.size / 2;
            },
            halfSize() {
                return this.size / 2;
            },
        },
    };
</script>
