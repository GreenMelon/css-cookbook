<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-1"
    >
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            :style="{
                top: '50%',
                left: '50%',
                transformOrigin: '50% 50%',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
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
})
</script>
