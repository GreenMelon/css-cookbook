<style lang="less">
.ribbon-alphabet-a {
    .ribbon-square {
        &:first-child {
            top: -6px;
            left: 50%;
            transform-origin: 0%;
            transform: rotate(90deg) skewY(14deg);
        }
        &:nth-child(2) {
            top: 50%;
            left: 50%;
            transform: translate(-56%, 0) skewX(-14deg);
        }
        &:nth-child(3) {
            top: -6px;
            left: 50%;
            transform-origin: 0%;
            transform: rotate(90deg) skewY(-14deg);
        }
    }
}
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-a"
    >
        <ribbon-square
            :size="size"
            :times="heightTimes"
            color="#e91a8c"
        />
        <ribbon-square
            :size="size"
            :times="1.3"
            color="#ff7f00"
        />
        <ribbon-square
            :size="size"
            :times="heightTimes"
            color="#7f00ff"
        />
    </RibbonAlphabet>
</template>

<script>
    import RibbonAlphabet from '../ribbon-alphabet';
    import RibbonSquare from '../ribbon-square';

    export default {
        name: 'ribbon-a',

        components: {
            RibbonAlphabet,
            RibbonSquare,
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
