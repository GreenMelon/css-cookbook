<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-d4"
    >
        <RibbonSharp
            :size="size"
            :times="heightTimes - 5"
            :z-index="1"
            :style="{
                top: '50%',
                left: `50%`,
                transform: 'translate(-50%, -50%) rotate(90deg)',
                marginLeft: `-${size * ((1 + widthTimes) / 2)}px`,
            }"
            color="#7f00ff"
        />
        <RibbonSharp
            :size="size"
            :times="1"
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
            color="#ff7f00"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            :style="{
                top: '0',
                left: '100%',
                transformOrigin: '0% 0%',
                transform: 'rotate(90deg)',
            }"
            color="#e91a8c"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :style="{
                bottom: '0',
                transform: 'rotate(180deg)',
            }"
            color="#411ad6"
        />
        <RibbonSharp
            :size="size"
            :times="1"
            :style="{
                top: '100%',
                left: '0',
                transformOrigin: '0% 0%',
                transform: 'rotate(-90deg)',
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
})
</script>
