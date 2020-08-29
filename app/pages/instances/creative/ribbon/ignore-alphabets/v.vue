<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-v"
    >
        <RibbonSharp
            :size="size"
            :times="heightTimes / 2 - 0.5"
            :z-index="1"
            :style="{
                top: '0',
                right: '100%',
                transformOrigin: '100% 0%',
                transform: 'rotate(-90deg)',
            }"
            color="#7f00ff"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes / 2"
            :style="{
                top: '100%',
                left: '50%',
                transformOrigin: '0% 50%',
                transform: `translateY(-50%) rotate(-90deg) skewY(-${degree}deg)`,
            }"
            color="#7f00ff"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes / 2 - 0.5"
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
                top: '100%',
                left: '50%',
                transformOrigin: '0% 50%',
                transform: `translateY(-50%) rotate(-90deg) skewY(${degree}deg)`,
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
            const width = (this.widthTimes + 1) / 2;
            const height = (this.heightTimes + 1) / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
    },
})
</script>
