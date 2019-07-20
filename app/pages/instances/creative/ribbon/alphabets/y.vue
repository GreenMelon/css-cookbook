<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-y"
    >
        <RibbonSquare
            :size="size"
            :times="heightTimes / 2"
            :style="{
                top: '50%',
                left: '50%',
                transformOrigin: '0% 50%',
                transform: `translateY(-50%) rotate(-90deg) skewY(-${degree}deg)`,
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
                transform: `translateY(-50%) rotate(-90deg) skewY(${degree}deg)`,
            }"
            color="#e91a8c"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '50%',
                left: '50%',
                transformOrigin: '0% 50%',
                transform: 'translateY(-50%) rotate(90deg)',
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
                const width = (1 + this.widthTimes + 1) / 2 - 0.5;
                const height = (1 + this.heightTimes + 1) / 2;

                return Math.atan(width / height) * 360 / (Math.PI * 2);
            },
        },
    });
</script>
