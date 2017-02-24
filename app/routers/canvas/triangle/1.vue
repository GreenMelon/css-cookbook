<style lang="less" scoped>

</style>

<template>
    <main>
        <nav>xxxx</nav>
        <ul>
            <li>
                <div>
                    <canvas id="canvas" width="800" height="600"></canvas>
                </div>
            </li>
        </ul>
    </main>
</template>

<script>
    module.exports = {
        methods: {
            draw() {
                let canvas = document.getElementById('canvas');
                let context = canvas.getContext('2d');

                context.beginPath();
                context.moveTo(100, 100);  // 顶点1
                context.lineTo(300, 300);  // 顶点2
                context.lineTo(300, 100);  // 顶点3
                context.lineTo(100, 100);  // 顶点1
                context.closePath();
                context.lineWidth = 5;
                // context.strokeStyle = '#c7254e';
                context.stroke();          // 绘制

                // context.fillStyle = 'rgb(250,250,0)';   // 填充的样式
                // context.fill();                         // 填充

            }
        },
        mounted() {
            this.draw();
        }
    }
</script>
