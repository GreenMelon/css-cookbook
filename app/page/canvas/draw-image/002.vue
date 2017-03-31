<style lang="less" scoped>
    #target {
        height: 120px;
        line-height: 120px;
        font-size: 60px;
        background-color: purple;
    }
    #btn-draw {
        display: inline-block;
        width: 100px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
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
        <button @click="draw" id="btn-draw" type="button">draw</button><br>
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
                let height = source.offsetHeight;
                let width = source.offsetWidth;
                let html = source.innerHTML;

                let styleSheet = `<style lang="css">
                    html, body {
                        margin: 0;
                        padding: 0;
                    }
                    #target {
                        height: 120px;
                        line-height: 120px;
                        font-size: 60px;
                        background-color: purple;
                    }
                </style>`;

                canvas.height = height;
                canvas.width = width;

                rasterizeHTML.drawHTML(styleSheet + html, {
                    width: width,
                    height: height
                })
                .then(res => {
                    context.drawImage(res.image, 0, 0, width, height, 0, 0, width, height);
                });
            }
        },
        mounted() {
            //
        }
    }
</script>
