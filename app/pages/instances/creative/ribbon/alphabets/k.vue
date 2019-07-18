<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-k"
    >
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '50%',
                transformOrigin: '0 0',
                transform: `translate(0, -50%) rotate(-${degree}deg)`,
            }"
            color="#ff7f00"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '50%',
                transformOrigin: '0 100%',
                transform: `translate(0, -50%) rotate(${degree}deg)`,
            }"
            color="#7f00ff"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :style="{
                top: `-${size}px`,
                left: '0%',
                transformOrigin: '0 100%',
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
                const width = 1 + this.widthTimes + 1;
                const height = (1 + this.heightTimes + 1) / 2 - 0.5;

                return Math.atan(height / width) * 360 / (Math.PI * 2);
            },
        },
    });
</script>
