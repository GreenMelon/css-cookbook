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
            <ribbon-a
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
            <ribbon-g
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
        <div class="row">
            <ribbon-u
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
    </main>
</template>

<script>
    import RibbonG from './alphabet/g';
    import RibbonU from './alphabet/u';
    import RibbonA from './alphabet/a';

    export default {
        components: {
            RibbonG,
            RibbonU,
            RibbonA,
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
