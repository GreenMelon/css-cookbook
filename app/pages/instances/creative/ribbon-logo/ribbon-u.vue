<style lang="less">
.ribbon-alphabet-u {
    .ribbon-sharp {
        &:first-child {
            transform: translate(-50%, -50%) rotate(-90deg);
        }
        &:nth-child(2) {
            transform: translate(-50%, -50%) rotate(180deg);
        }
        &:nth-child(3) {
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
        class="ribbon-alphabet-u"
    >
        <ribbon-sharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            color="#e91a8c"
            :style="{
                marginLeft: `-${halfWidth - halfSize}px`,
            }"
        />
        <ribbon-sharp
            :size="size"
            :times="widthTimes"
            color="#7f00ff"
            :style="{
                marginTop: `${halfHeight - halfSize}px`,
            }"
        />
        <ribbon-sharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            color="#411ad6"
            :style="{
                marginLeft: `${halfWidth - halfSize}px`,
            }"
        />
    </RibbonAlphabet>
</template>

<script>
    import RibbonAlphabet from './ribbon-alphabet';
    import RibbonSharp from './ribbon-sharp';

    export default {
        name: 'ribbon-u',

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
