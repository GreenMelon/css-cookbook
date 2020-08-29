<style lang="less" scoped>
    @import '../../../less/base/variable.less';

    p {
      line-height: 1.68;
    }

    .wrapper {
        margin: 0 auto;
        width: 62%;
        padding: 30px;
    }

    .circle {
        float: left;
        width: 250px;
        height: 250px;
        border-radius: 50%;
        background-color: @green;
    }
    .shape{
        margin: 10px;
        -webkit-shape-outside: circle();
        shape-outside: circle();
    }
</style>

<template>
    <main>
        <button @click="toggleShape" type="button">Shape</button>
        <div class="wrapper clearfix">
            <div :class="{shape: isShape}" class="circle"></div>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio ducimus, minus distinctio quae alias velit vel quas aliquid laboriosam, expedita reiciendis, aperiam quos! Soluta necessitatibus commodi adipisci eum optio mollitia.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At provident in commodi similique deserunt atque nostrum fuga aspernatur eos quisquam.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, sit.</p>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            isShape: false
        }
    },
    methods: {
        toggleShape() {
            this.isShape = !this.isShape;
        }
    },
}
</script>
