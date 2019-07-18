<style lang="less" scoped>
.row {
    display: flex;
    justify-content: space-around;
    margin: 20px auto;
}
</style>

<template>
    <main>
        <div class="row">
            <RibbonA
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
            <RibbonG
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
        <div class="row">
            <RibbonK
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
        <div class="row">
            <RibbonU
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
    </main>
</template>

<script>
    import RibbonA from './alphabet/a';
    import RibbonG from './alphabet/g';
    import RibbonK from './alphabet/k';
    import RibbonU from './alphabet/u';

    export default {
        components: {
            RibbonA,
            RibbonG,
            RibbonK,
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
