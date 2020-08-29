<style lang="less" scoped>
form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
    textarea {
        width: 400px;
        height: 100px;
        padding: 16px;
    }
}
.alphabet-name {
    display: flex;
    justify-content: center;
}
</style>

<template>
    <main>
        <form>
            <textarea v-model="content">
            </textarea>
        </form>

        <template v-for="(word, index) in words">
            <div
                :key="index"
                class="alphabet-name"
            >
                <component
                    v-for="(item, subIndex) in word"
                    :key="`${index}-${subIndex}`"
                    :is="`Alphabet${item}`"
                />
            </div>
        </template>
    </main>
</template>

<script>
import RibbonAlphabet from './ignore-ribbon-alphabet';
import AlphabetA from './ignore-alphabets/a';
import AlphabetA1 from './ignore-alphabets/a1';
import AlphabetA2 from './ignore-alphabets/a2';
import AlphabetB from './ignore-alphabets/b';
import AlphabetC from './ignore-alphabets/c';
import AlphabetD from './ignore-alphabets/d';
import AlphabetD1 from './ignore-alphabets/d1';
import AlphabetD2 from './ignore-alphabets/d2';
import AlphabetD3 from './ignore-alphabets/d3';
import AlphabetD4 from './ignore-alphabets/d4';
import AlphabetE from './ignore-alphabets/e';
import AlphabetF from './ignore-alphabets/f';
import AlphabetG from './ignore-alphabets/g';
import AlphabetH from './ignore-alphabets/h';
import AlphabetI from './ignore-alphabets/i';
import AlphabetJ from './ignore-alphabets/j';
import AlphabetK from './ignore-alphabets/k';
import AlphabetL from './ignore-alphabets/l';
import AlphabetM from './ignore-alphabets/m';
import AlphabetM1 from './ignore-alphabets/m1';
import AlphabetM2 from './ignore-alphabets/m2';
import AlphabetN from './ignore-alphabets/n';
import AlphabetO from './ignore-alphabets/o';
import AlphabetP from './ignore-alphabets/p';
import AlphabetQ from './ignore-alphabets/q';
import AlphabetQ1 from './ignore-alphabets/q1';
import AlphabetR from './ignore-alphabets/r';
import AlphabetS from './ignore-alphabets/s';
import AlphabetT from './ignore-alphabets/t';
import AlphabetU from './ignore-alphabets/u';
import AlphabetV from './ignore-alphabets/v';
import AlphabetV1 from './ignore-alphabets/v1';
import AlphabetW from './ignore-alphabets/w';
import AlphabetW1 from './ignore-alphabets/w1';
import AlphabetW2 from './ignore-alphabets/w2';
import AlphabetX from './ignore-alphabets/x';
import AlphabetY from './ignore-alphabets/y';
import AlphabetY1 from './ignore-alphabets/y1';
import AlphabetY2 from './ignore-alphabets/y2';
import AlphabetZ from './ignore-alphabets/z';
import AlphabetZ1 from './ignore-alphabets/z1';
import AlphabetZ2 from './ignore-alphabets/z2';
import Alphabet0 from './ignore-numbers/0';
import Alphabet1 from './ignore-numbers/1';
import Alphabet2 from './ignore-numbers/2';
import Alphabet3 from './ignore-numbers/3';
import Alphabet4 from './ignore-numbers/4';
import Alphabet5 from './ignore-numbers/5';
import Alphabet6 from './ignore-numbers/6';
import Alphabet7 from './ignore-numbers/7';
import Alphabet8 from './ignore-numbers/8';
import Alphabet9 from './ignore-numbers/9';

export default {
    components: {
        RibbonAlphabet,
        AlphabetA,
        AlphabetA1,
        AlphabetA2,
        AlphabetB,
        AlphabetC,
        AlphabetD,
        AlphabetD1,
        AlphabetD2,
        AlphabetD3,
        AlphabetD4,
        AlphabetE,
        AlphabetF,
        AlphabetG,
        AlphabetH,
        AlphabetI,
        AlphabetJ,
        AlphabetK,
        AlphabetL,
        AlphabetM,
        AlphabetM1,
        AlphabetM2,
        AlphabetN,
        AlphabetO,
        AlphabetP,
        AlphabetQ,
        AlphabetQ1,
        AlphabetR,
        AlphabetS,
        AlphabetT,
        AlphabetU,
        AlphabetV,
        AlphabetV1,
        AlphabetW,
        AlphabetW1,
        AlphabetW2,
        AlphabetX,
        AlphabetY,
        AlphabetY1,
        AlphabetY2,
        AlphabetZ,
        AlphabetZ1,
        AlphabetZ2,
        Alphabet0,
        Alphabet1,
        Alphabet2,
        Alphabet3,
        Alphabet4,
        Alphabet5,
        Alphabet6,
        Alphabet7,
        Alphabet8,
        Alphabet9,
        
    },

    data() {
        return {
            content: 'love\na1nd\npeace',
        };
    },

    computed: {
        words() {
            const res = this.content.toUpperCase().split('\n');
            const regexp = /([A-Z]\d?)|(-\d)/g;

            res.forEach((group, index) => {
                let r = group.match(regexp) || [];
                r = r.map(i => i.replace('-', ''));
                res[index] = r;
            });

            return res;
        },
    },
}
</script>
