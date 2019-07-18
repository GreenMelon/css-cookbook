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
            <AlphabetM1 />
            <AlphabetM2 />
            <AlphabetM3 />
            <AlphabetN />
        </div>
        <div class="row">
            <AlphabetP />
            <AlphabetQ1 />
            <AlphabetQ2 />
            <AlphabetQ3 />
            <AlphabetR />
        </div>
        <div class="row">
            <AlphabetU />
            <AlphabetV />
            <AlphabetW1 />
            <AlphabetW2 />
            <AlphabetW3 />
        </div>
    </main>
</template>

<script>
    import AlphabetA from './alphabets/a';
    import AlphabetG from './alphabets/g';
    import AlphabetK from './alphabets/k';
    import AlphabetM1 from './alphabets/m1';
    import AlphabetM2 from './alphabets/m2';
    import AlphabetM3 from './alphabets/m3';
    import AlphabetN from './alphabets/n';
    import AlphabetP from './alphabets/p';
    import AlphabetQ1 from './alphabets/q1';
    import AlphabetQ2 from './alphabets/q2';
    import AlphabetQ3 from './alphabets/q3';
    import AlphabetR from './alphabets/r';
    import AlphabetU from './alphabets/u';
    import AlphabetV from './alphabets/v';
    import AlphabetW1 from './alphabets/w1';
    import AlphabetW2 from './alphabets/w2';
    import AlphabetW3 from './alphabets/w3';

    export default {
        components: {
            AlphabetA,
            AlphabetG,
            AlphabetK,
            AlphabetM1,
            AlphabetM2,
            AlphabetM3,
            AlphabetN,
            AlphabetP,
            AlphabetQ1,
            AlphabetQ2,
            AlphabetQ3,
            AlphabetR,
            AlphabetU,
            AlphabetV,
            AlphabetW1,
            AlphabetW2,
            AlphabetW3,
        },
    };
</script>
