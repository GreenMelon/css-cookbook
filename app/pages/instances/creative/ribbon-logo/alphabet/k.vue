<style lang="less">
    .ribbon-alphabet-k {
        .ribbon-sharp {
            &:first-child {
                transform: translate(-50%, -50%) rotate(-90deg);
            }
        }
        .ribbon-square {
            &:nth-child(2) {
                top: 50%;
                left: 12px;
                transform: translate(0, -100%) rotate(-45deg);
                transform-origin: 0 100%;
            }
            &:nth-child(3) {
                top: 50%;
                left: 12px;
                transform: rotate(45deg);
                transform-origin: 0 0;
            }
        }
    }
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-k"
    >
        <ribbon-sharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            color="#e91a8c"
            :style="{
                marginLeft: `-${halfWidth - halfSize}px`,
            }"
        />
        <ribbon-square
            :size="size"
            :times="7.07"
            color="#ff7f00"
        />
        <ribbon-square
            :size="size"
            :times="heightTimes"
            color="#7f00ff"
        />
    </RibbonAlphabet>
</template>

<script>
    import Vue from 'vue';
    import baseAlphabet from '../base-alphabet';

    export default Vue.extend({
        mixins: [baseAlphabet],
    });
</script>
