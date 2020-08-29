<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-t"
    >
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :z-index="1"
            color="#e91a8c"
        />
        <RibbonSquare
            :size="size"
            :times="heightTimes"
            :style="{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)',
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
