<style lang="less" scoped>
    #target {
        margin-top: 20px;
        height: 120px;
        line-height: 120px;
        font-size: 60px;
        background-color: purple;
        // background-image: url('20170202-095029-1.jpg');
    }
    #btn-draw {
        display: inline-block;
        width: 100px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
    }
    #bg {
        height: 60px;
    }
    #insert-zone {
        // height: 0;
        // overflow-x: hidden;
    }
</style>

<template>
    <main>
        <h1>截图功能</h1>
        <div id="source">
            <div id="target">
            <!-- <div id="target" style="
                background-image: url('https://st0.dancf.com/www/15018/design/20170202-095029-1.jpg')
            "> -->
                <div id="bg" style="
                    background-image: url('https://st0.dancf.com/www/15018/design/20170202-095029-1.jpg')
                "></div>
                <span style="color: gold">TEXT</span>
                <!-- Access-Control-Allow-Origin: no -->
                <!-- <img src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png" alt="baidu" style="height: 100%;"> -->
                <!-- Access-Control-Allow-Origin: yes -->
                <!-- <img src="https://st0.dancf.com/www/15018/design/20170202-095029-1.jpg" alt="baidu" style="height: 100%;"> -->
            </div>
        </div>
        <div id="insert-zone"></div>
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

                let insertZone = document.getElementById('insert-zone');
                let source_mirror = source.cloneNode(true);
                insertZone.appendChild(source_mirror);
                let _replaceElem = function replaceElem(elem) {
                    for (let i = 0, j = elem.childNodes.length; i < j; i++) {
                        let childElem = elem.childNodes[i];

                        if(childElem.childNodes.length) {
                            replaceElem(childElem);
                        }
                        else {
                            if (childElem.style && childElem.style.backgroundImage) {
                                const reg_url = /https?[\s\S]+(jpe?g|png|gif)/gi;
                                let backgroundImage = childElem.style.backgroundImage;
                                let url = backgroundImage.match(reg_url);
                                url = url ? url[0] : null;

                                if (url) {
                                    let img = document.createElement('img');

                                    img.height = childElem.offsetHeight;
                                    img.width = childElem.offsetWidth;
                                    img.src = url;
                                    debugger;

                                    childElem.parentNode.replaceChild(img, childElem);
                                }
                            }
                        }
                    }
                };

                _replaceElem(source_mirror);
                let html = source_mirror.innerHTML;
                return;

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
                    #bg {
                        height: 60px;
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
