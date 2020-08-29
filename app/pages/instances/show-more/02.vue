<style scoped>
.box {
    margin-bottom: .5em;
    width: 10em;
    height: 2.1em;
    border: 1px solid black;
    overflow: hidden;
    line-height: 1em;
}

#more:target {
    height: auto;
}

.detail-control a {
    display: inline;
}
.detail-control a + a {
    display: none;
}

#more:target + .detail-control a {
    display: none;
}
#more:target + .detail-control a + a {
    display: inline;
}
</style>

<template>
    <main>
        <div class="box" id="more">
            <p>通过锚点的特性来展示更多的内容部分。通过锚点的特性来展示更多的内容部分。通过锚点的特性来展示更多的内容部分。</p>
        </div>

        <div class="detail-control">
            <a href="#more">更多</a>
            <a href="#">缩小</a>
        </div>
    </main>
</template>

<script>
export default {}
</script>
