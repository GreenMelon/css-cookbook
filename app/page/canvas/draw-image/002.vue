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
                <!-- Access-Control-Allow-Origin: no -->
                <img src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png" alt="baidu" style="height: 100%;">
                <!-- Access-Control-Allow-Origin: yes -->
                <img src="https://st0.dancf.com/www/20775/design/20170127-142439-17.jpg" alt="baidu" style="height: 100%;">
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
            },
            base64() {
                // get svg data
                // var xml = new XMLSerializer().serializeToString(svg);
                // make it base64
                // var svg64 = btoa(xml);
                // var b64Start = 'data:image/svg+xml;base64,';

                // prepend a "header"
                // var image64 = b64Start + svg64;

                // set it as the source of the img element
                // img.src = image64;

            }
        },
        mounted() {
            //
        }
    }
</script>
