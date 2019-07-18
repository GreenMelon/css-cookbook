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
            :style="{
                marginTop: `-${halfHeight - halfSize}px`,
            }"
            color="#e91a8c"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            :style="{
                marginLeft: `-${halfWidth - halfSize}px`,
                transform: 'translate(-50%, -50%) rotate(-90deg)',
            }"
            color="#7f00ff"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :style="{
                marginTop: `${halfHeight - halfSize}px`,
                transform: 'translate(-50%, -50%) rotate(180deg)',
            }"
            color="#411ad6"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes / 2"
            :z-index="1"
            :style="{
                marginTop: `${halfHeight - halfWidth}px`,
                marginLeft: `${halfWidth - halfSize}px`,
                transform: 'translate(-50%, -50%) rotate(90deg)',
            }"
            color="#ff7f00"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes / 2"
            :style="{
                marginTop: `-${halfSize}px`,
                marginLeft: `${(halfWidth) / 2 - halfSize}px`,
            }"
            color="#5ceaa2"
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
