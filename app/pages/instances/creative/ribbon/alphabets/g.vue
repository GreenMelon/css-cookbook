<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-g"
    >
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            color="#e91a8c"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            :style="{
                top: '0',
                right: `${halfWidth * 2}px`,
                transformOrigin: '100% 0%',
                transform: 'rotate(-90deg)',
            }"
            color="#ff7f00"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :style="{
                bottom: '0',
                transform: 'rotate(180deg)',
            }"
            color="#7f00ff"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :z-index="1"
            :style="{
                right: `${size}px`,
                bottom: '0',
                transformOrigin: '100% 100%',
                transform: 'rotate(90deg)',
            }"
            color="#411ad6"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes / 2"
            :style="{
                top: '50%',
                right: '0%',
                transform: 'translate(0, -50%)',
                marginTop: `-${size / 2}px`,
            }"
            color="#41b883"
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
