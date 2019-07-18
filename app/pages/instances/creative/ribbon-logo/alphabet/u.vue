<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-u"
    >
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            :style="{
                marginLeft: `-${halfWidth - halfSize}px`,
                transform: 'translate(-50%, -50%) rotate(-90deg)',
            }"
            color="#e91a8c"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :style="{
                marginTop: `${halfHeight - halfSize}px`,
                transform: 'translate(-50%, -50%) rotate(180deg)',
            }"
            color="#7f00ff"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :z-index="1"
            :style="{
                marginLeft: `${halfWidth - halfSize}px`,
                transform: 'translate(-50%, -50%) rotate(90deg)',
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
    });
</script>
