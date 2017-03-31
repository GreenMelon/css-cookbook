<style lang="less" scoped>
    #target {
        height: 120px;
        line-height: 120px;
        font-size: 60px;
        background-color: purple;
    }
    button {
        display: inline-block;
        width: 100px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
    }
    canvas {
        // display: block;
    }
</style>

<template>
    <main>
        <h1>截图功能</h1>
        <div id="source">
            <div id="target">
                <span style="color: gold">TEXT</span>
            </div>
        </div>
        <button @click="draw" type="button">export</button><br>
        <canvas id="canvas" width="1000" height="100"></canvas>
    </main>
</template>

<script>
    import rasterizeHTML from 'rasterizehtml';

    module.exports = {
        methods: {
            draw() {
                let canvas = document.getElementById('canvas');
                let context = canvas.getContext('2d');

                let source = document.getElementById('source');
                let offsetX = source.offsetLeft;
                let offsetY = source.offsetTop;
                let height = source.offsetHeight;
                let width = source.offsetWidth;

                canvas.height = height;
                canvas.width = width;

                const docElem = document.documentElement;
                let docHeight = docElem.scrollHeight;
                let docWidth = docElem.scrollWidth;

                rasterizeHTML.drawHTML(docElem.innerHTML, {
                    width: docWidth,
                    height: docHeight
                })
                .then(res => {
                    const image = res.image;
                    context.drawImage(image, offsetX, offsetY, width, height, 0, 0, width, height);
                });
            }
        },
        mounted() {
            //
        }
    }
</script>
