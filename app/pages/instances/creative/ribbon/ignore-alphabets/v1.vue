<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-v1"
    >
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '100%',
                left: '50%',
                marginTop: `-${size / 2}px`,
                transformOrigin: '0% 50%',
                transform: `rotate(-90deg) skewY(-${degree}deg)`,
            }"
            color="#7f00ff"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '100%',
                left: '50%',
                marginTop: `-${size / 2}px`,
                transformOrigin: '0% 50%',
                transform: `rotate(-90deg) skewY(${degree}deg)`,
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
            const height = (1 + this.heightTimes + 1);

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
    },
})
</script>
