<style lang="less" scoped>
    @import '../../../less/base/variable.less';

    p {
      line-height: 1.68;
    }

    .wrapper {
        width: 100%;
        margin: 0 auto;
    }
    .shape {
        float: left;
        background-size: contain;
        background-repeat: no-repeat;
        margin: 30px;
        width: 265px;
        height: 265px;
        shape-margin: 20px;
    }
    .pentagon {
        background-image: url('https://lourfield.github.io/advanced-css-shapes/img/pentagon.svg');
        shape-outside: polygon(32px 126px, 163px 32px, 293px 127px, 244px 282px, 82px 281px);
    }
</style>

<template>
    <main>
        <!-- <button @click="toggleShape" type="button">Shape</button> -->
        <div class="wrapper clearfix">
            <div class="shape pentagon"></div>
            <blockquote>
                <p>In geometry, a pentagon is any five-sided polygon or 5-gon. The sum of the internal angles in a simple pentagon is 540°. A pentagon may be simple or self-intersecting. A self-intersecting regular pentagon (or star pentagon) is called a pentagram.</p>
                <cite><a href="https://en.wikipedia.org/wiki/Pentagon"></a>Wikipedia</cite>
            </blockquote>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            isShape: true
        }
    },
    methods: {
        toggleShape() {
            this.isShape = !this.isShape;
        }
    },
}
</script>
