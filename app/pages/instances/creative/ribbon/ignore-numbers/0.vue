<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-0"
    >
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            color="#ff7f00"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes / 2 - 0.5"
            :z-index="1"
            :style="{
                top: '0',
                right: '100%',
                transformOrigin: '100% 0%',
                transform: 'rotate(-90deg)',
            }"
            color="#7f00ff"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes / 2 - 0.5"
            :z-index="1"
            :style="{
                top: '50%',
                right: '100%',
                transformOrigin: '100% 0%',
                transform: 'rotate(-90deg)',
                marginTop: `-${size / 2}px`,
            }"
            color="#7f00ff"
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
            :times="heightTimes / 2 - 0.5"
            :z-index="1"
            :style="{
                right: `${size}px`,
                bottom: '0',
                transformOrigin: '100% 100%',
                transform: 'rotate(90deg)',
            }"
            color="#e91a8c"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes / 2 - 0.5"
            :z-index="1"
            :style="{
                top: '0',
                left: '100%',
                transformOrigin: '0% 0%',
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
})
</script>
