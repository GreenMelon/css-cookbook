<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-n1"
    >
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: `-${size}px`,
                left: '0',
                transformOrigin: '0% 100%',
                transform: 'rotate(90deg)',
            }"
            color="#7f00ff"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(90deg) skewY(-${degree}deg)`,
            }"
            color="#ff7f00"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: `-${size}px`,
                right: '0',
                transformOrigin: '100% 100%',
                transform: 'rotate(-90deg)',
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
            const width = (1 + this.widthTimes + 1) - 1;
            const height = (1 + this.heightTimes + 1);

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
    },
})
</script>
