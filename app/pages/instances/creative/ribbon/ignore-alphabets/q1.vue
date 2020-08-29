<style lang="less">
.ribbon-alphabet-q1 {
    .ribbon-sharp {
        &:nth-child(3) {
            .left {
                transform: rotate(-90deg);
            }
        }
        &:nth-child(4) {
            .right {
                transform: rotate(90deg);
            }
        }
    }
}
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-q1"
    >
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            color="#ff7f00"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            :style="{
                top: '0',
                right: `${halfWidth * 2}px`,
                transformOrigin: '100% 0%',
                transform: 'rotate(-90deg)',
            }"
            color="#7f00ff"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes / 2"
            :style="{
                bottom: '0',
                transform: 'rotate(180deg)',
            }"
            color="#411ad6"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes * (3 / 4)"
            :z-index="1"
            :style="{
                top: '0',
                left: '100%',
                transformOrigin: '0% 0%',
                transform: 'rotate(90deg)',
            }"
            color="#e91a8c"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes / 2"
            :style="{
                marginTop: `-${size / 2}px`,
                top: `50%`,
                left: '50%',
                transformOrigin: '0% 100%',
                transform: `rotate(90deg) skewY(-${degree}deg)`,
            }"
            color="#ff7f00"
        />
    </RibbonAlphabet>
</template>

<script>
import Vue from 'vue';
import baseAlphabet from '../base-alphabet';

export default Vue.extend({
    mixins: [baseAlphabet],

    computed: {
        degree() {
            const width = this.widthTimes / 2 - 0.25;
            const height = this.heightTimes / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
    },
})
</script>
