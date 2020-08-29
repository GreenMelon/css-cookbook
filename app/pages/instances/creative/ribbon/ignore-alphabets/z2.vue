<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-z2"
    >
        <RibbonSquare
            :size="size"
            :times="widthTimes"
            :style="{
                top: '0',
                left: '0',
            }"
            color="#e91a8c"
        />
        <RibbonSquare
            :size="size"
            :times="widthTimes"
            :style="{
                top: `50%`,
                left: '0',
                marginTop: `-${size / 2}px`,
                transform: `skewY(-${degree}deg)`,
            }"
            color="#ff7f00"
        />
        <RibbonSquare
            :size="size"
            :times="widthTimes"
            :style="{
                bottom: '0',
                left: '0',
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
            const width = 1 + this.heightTimes;
            const height = 1 + this.widthTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
    },
})
</script>
