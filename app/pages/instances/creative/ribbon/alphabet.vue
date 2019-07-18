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
            <AlphabetM
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
            <AlphabetN
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
        <div class="row">
            <AlphabetP
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
            <AlphabetW
                :size="size"
                :width-times="widthTimes"
                :height-times="heightTimes"
            />
        </div>
    </main>
</template>

<script>
    import AlphabetA from './alphabets/a';
    import AlphabetG from './alphabets/g';
    import AlphabetK from './alphabets/k';
    import AlphabetM from './alphabets/m';
    import AlphabetN from './alphabets/n';
    import AlphabetP from './alphabets/p';
    import AlphabetU from './alphabets/u';
    import AlphabetV from './alphabets/v';
    import AlphabetW from './alphabets/w';

    export default {
        components: {
            AlphabetA,
            AlphabetG,
            AlphabetK,
            AlphabetM,
            AlphabetN,
            AlphabetP,
            AlphabetU,
            AlphabetV,
            AlphabetW,
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
