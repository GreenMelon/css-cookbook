<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-q"
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
            :times="widthTimes"
            :style="{
                bottom: '0',
                transform: 'rotate(180deg)',
            }"
            color="#411ad6"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes"
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
            :times="widthTimes / 4"
            :z-index="1"
            :style="{
                right: `${size / 2}px`,
                bottom: '0',
                outline: `${size / 4}px solid #FFF`,
                transformOrigin: '100% 50%',
                transform: 'rotate(45deg)',
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
