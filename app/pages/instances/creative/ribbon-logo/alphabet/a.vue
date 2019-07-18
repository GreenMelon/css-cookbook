<style lang="less">
.ribbon-alphabet-a {
    .ribbon-square {
        &:first-child {
            top: -6px;
            left: 50%;
            transform-origin: 0%;
            transform: rotate(90deg) skewY(14deg);
        }
        &:nth-child(2) {
            top: 50%;
            left: 50%;
            transform: translate(-56%, 0) skewX(-14deg);
        }
        &:nth-child(3) {
            top: -6px;
            left: 50%;
            transform-origin: 0%;
            transform: rotate(90deg) skewY(-14deg);
        }
    }
}
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-a"
    >
        <ribbon-square
            :size="size"
            :times="heightTimes"
            color="#e91a8c"
        />
        <ribbon-square
            :size="size"
            :times="1.3"
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
