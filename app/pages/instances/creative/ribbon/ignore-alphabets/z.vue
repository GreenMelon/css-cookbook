<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-z"
    >
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            color="#e91a8c"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes - 2"
            :style="{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(-90deg) skewY(${degree}deg)`,
            }"
            color="#ff7f00"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :style="{
                bottom: '0',
                left: '0',
                transform: 'rotate(180deg)',
            }"
            color="#7f00ff"
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
            const width = 1 + this.widthTimes;
            const height = this.heightTimes;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
    },
})
</script>
