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
            <AlphabetA
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
            <AlphabetG
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
        <div class="row">
            <AlphabetK
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
        <div class="row">
            <AlphabetU
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
            <AlphabetV
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
    </main>
</template>

<script>
    import AlphabetA from './alphabet/a';
    import AlphabetG from './alphabet/g';
    import AlphabetK from './alphabet/k';
    import AlphabetU from './alphabet/u';
    import AlphabetV from './alphabet/v';

    export default {
        components: {
            AlphabetA,
            AlphabetG,
            AlphabetK,
            AlphabetU,
            AlphabetV,
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
