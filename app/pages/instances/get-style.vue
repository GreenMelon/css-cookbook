<style scoped lang="less">
    #container {
        line-height: 1.5;
    }
    .element {
        font-family: Helvetica;
        &::before {
            content: "hi, ";
        }
    }
</style>

<template>
    <main>
        <div id="container">
            <p class="element" style="font-size: 2em; color: red;">this is a paragraph.</p>
        </div>

        <button @click="getInlineStyle">getInlineStyle</button>
        <button @click="getComputedStyle">getComputedStyle</button>
    </main>
</template>

<script>
    export default {
        data() {
            return {};
        },
        methods: {
            getInlineStyle() {
                const element = document.querySelector('.element');
                const { style } = element;
 
                console.log('inlineStyle', style);
                /**
                 * style[0]           =>  'font-size'
                 * style[1]           =>  'color'
                 * style['fontSize']  =>  '2em'
                 * style['color']     =>  'red'
                 * style['cssText']   =>  'font-size: 2em; color: red;'
                 */
            },
            getComputedStyle() {
                const element = document.querySelector('.element')
                const style = getComputedStyle(element); // 返回一个包含每个CSS属性及其各自值的对象

                console.log('computedStyle', style);
                /**
                 * style['fontSize']  =>  '28px'
                 * style['color']     =>  'rgb(255, 0, 0)'
                 * style['fontFamily']  =>  'Helvetica'
                 * style['lineHeight']  =>  '42px'
                 */

                const pseudoElementStyle = getComputedStyle(element, '::before');
                console.log('pseudoElementStyle', pseudoElementStyle);
            },
        },
    };
</script>
