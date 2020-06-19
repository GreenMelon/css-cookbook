<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-z1"
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
            :times="heightTimes * 2"
            :style="{
                top: `-${size}px`,
                left: '100%',
                transformOrigin: '0% 100%',
                transform: `rotate(${90 + degree}deg)`,
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
                const width = 1 + this.widthTimes + 1;
                const height = 1 + this.heightTimes;

                return Math.atan(width / height) * 360 / (Math.PI * 2);
            },
        },
    });
</script>
