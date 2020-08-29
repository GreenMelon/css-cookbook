<style lang="less">
.ribbon-alphabet-m {
    .ribbon-sharp {
        &:first-child {
            .right {
                border-right-color: #FFF !important;
            }
        }
        &:last-child {
            .left {
                border-left-color: #FFF !important;
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
        class="ribbon-alphabet-m"
    >
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
        <RibbonSquare
            :size="size"
            :times="heightTimes / 2"
            :style="{
                top: '50%',
                left: '50%',
                transformOrigin: '0% 50%',
                transform: `translateY(-50%) rotate(-90deg) skewY(-${degree}deg)`,
            }"
            color="#411ad6"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes / 2"
            :style="{
                top: '50%',
                left: '50%',
                transformOrigin: '0% 50%',
                transform: `translateY(-50%) rotate(-90deg) skewY(${degree}deg)`,
            }"
            color="#ff7f00"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            :style="{
                top: '0',
                left: `${halfWidth * 2}px`,
                transformOrigin: '0% 0%',
                transform: 'rotate(90deg)',
            }"
            color="#e91a8c"
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
            const width = (1 + this.widthTimes + 1) / 2 - 0.5;
            const height = (1 + this.heightTimes + 1) / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
    },
})
</script>
