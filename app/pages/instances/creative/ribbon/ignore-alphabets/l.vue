<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-l"
    >
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
            color="#7f00ff"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :style="{
                bottom: '0',
                transform: 'rotate(180deg)',
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
