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
            <AlphabetA />
            <AlphabetG />
        </div>
        <div class="row">
            <AlphabetK />
            <AlphabetM />
            <AlphabetN />
        </div>
        <div class="row">
            <AlphabetP />
            <AlphabetQ1 />
            <AlphabetQ2 />
            <AlphabetR />
        </div>
        <div class="row">
            <AlphabetU />
            <AlphabetV />
            <AlphabetW />
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
    import AlphabetQ1 from './alphabets/q1';
    import AlphabetQ2 from './alphabets/q2';
    import AlphabetR from './alphabets/r';
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
            AlphabetQ1,
            AlphabetQ2,
            AlphabetR,
            AlphabetU,
            AlphabetV,
            AlphabetW,
        },
    };
</script>
