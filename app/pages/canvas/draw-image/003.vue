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
    #img {
        display: inline-block;
        height: 100%;
        width: 300px;
        background: url(https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png);
        background: url(https://st0.dancf.com/www/20775/design/20170127-142439-17.jpg);
    }
</style>

<template>
    <main>
        <h1>截图功能</h1>
        <button @click="draw" id="btn-draw" type="button">draw</button><br>
        <canvas id="canvas" width="1000" height="100"></canvas>
    </main>
</template>

<script>
    import rasterizeHTML from 'rasterizehtml';

    export default {
        methods: {
            draw() {
                let canvas = document.getElementById('canvas');
                let context = canvas.getContext('2d');

                let rootElem =  document.documentElement;
                let height = rootElem.offsetHeight;
                let width = rootElem.offsetWidth;

                let URL = 'https://baidu.com';

                rasterizeHTML.drawURL(URL, {
                    height: height,
                    width: width
                })
                .then(res => {
                    context.drawImage(res.image, 0, 0);
                });
            }
        },
        mounted() {
            //
        }
    }
</script>
