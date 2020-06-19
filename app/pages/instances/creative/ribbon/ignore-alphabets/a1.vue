<style lang="less">
.ribbon-alphabet-a1 {
    .ribbon-square {
        &:nth-child(3)::after {
            content: "";
            position: absolute;
            top: -100%;
            width: 100%;
            height: 100%;
            background: #FFF;
        }
    }
}
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-a1"
    >
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: `-${size / 2}px`,
                left: '50%',
                transformOrigin: '0% 50%',
                transform: `rotate(90deg) skewY(${degree}deg)`,
            }"
            color="#7f00ff"
        />
        <RibbonSquare
            :size="size"
            :times="middleTimes"
            :style="{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) skewX(-${degree}deg)`,
            }"
            color="#ff7f00"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: `-${size / 2}px`,
                left: '50%',
                transformOrigin: '0% 50%',
                transform: `rotate(90deg) skewY(-${degree}deg)`,
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

            middleTimes() {
                return (this.widthTimes / 2) - 0.5;
            },
        },
    });
</script>
