<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-w1"
    >
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '100%',
                left: '25%',
                marginTop: `-${size / 2}px`,
                transformOrigin: '0% 50%',
                transform: `rotate(-90deg) skewY(-${degree1}deg)`,
            }"
            color="#e91a8c"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '100%',
                left: '25%',
                marginTop: `-${size / 2}px`,
                transformOrigin: '0% 50%',
                transform: `rotate(-90deg) skewY(${degree2}deg)`,
            }"
            color="#ff7f00"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '100%',
                left: '75%',
                marginTop: `-${size / 2}px`,
                transformOrigin: '0% 50%',
                transform: `rotate(-90deg) skewY(-${degree2}deg)`,
            }"
            color="#7f00ff"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '100%',
                left: '75%',
                marginTop: `-${size / 2}px`,
                transformOrigin: '0% 50%',
                transform: `rotate(-90deg) skewY(${degree1}deg)`,
            }"
            color="#411ad6"
        />
    </RibbonAlphabet>
</template>

<script>
    import Vue from 'vue';
    import baseAlphabet from '../base-alphabet';

    export default Vue.extend({
        mixins: [baseAlphabet],

        computed: {
            degree1() {
                const width = (1 + this.widthTimes + 1) / 4 - 0.5;
                const height = (1 + this.heightTimes + 1);

                return Math.atan(width / height) * 360 / (Math.PI * 2);
            },
            degree2() {
                const width = (1 + this.widthTimes + 1) / 4;
                const height = (1 + this.heightTimes + 1);

                return Math.atan(width / height) * 360 / (Math.PI * 2);
            },
        },
    });
</script>
