<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-x"
    >
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(90deg) skewY(-${degree}deg)`,
            }"
            color="#7f00ff"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(90deg) skewY(${degree}deg)`,
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
            const width = 1 + this.widthTimes;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
    },
})
</script>
