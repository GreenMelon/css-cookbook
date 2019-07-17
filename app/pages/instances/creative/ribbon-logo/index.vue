<style lang="less" scoped>
</style>

<template>
    <main>
        <ribbon-g
            :size="size"
            :width-times="widthTimes"
            :height-times="heightTimes"
        />
        <ribbon-u
            :size="size"
            :width-times="widthTimes"
            :height-times="heightTimes"
        />
    </main>
</template>

<script>
    import RibbonG from './ribbon-g';
    import RibbonU from './ribbon-u';

    export default {
        components: {
            RibbonG,
            RibbonU,
        },

        data() {
            return {
                size: 12,
                widthTimes: 4,
                heightTimes: 8,
            };
        },
    };
</script>
