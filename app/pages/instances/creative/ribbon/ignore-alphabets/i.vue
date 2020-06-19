<style lang="less">
</style>

<template>
    <RibbonAlphabet
        :size="size"
        :width-times="widthTimes"
        :height-times="heightTimes"
        class="ribbon-alphabet-i"
    >
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :z-index="1"
            :style="{
                top: '0',
                left: '50%',
                transform: 'translate(-50%, 0)',
            }"
            color="#e91a8c"
        />
        <RibbonSharp
            :size="size"
            :times="heightTimes"
            :style="{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)',
            }"
            color="#ff7f00"
        />
        <RibbonSharp
            :size="size"
            :times="widthTimes"
            :z-index="1"
            :style="{
                bottom: '0',
                left: '50%',
                transform: 'translate(-50%, 0) rotate(180deg)',
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
    });
</script>
