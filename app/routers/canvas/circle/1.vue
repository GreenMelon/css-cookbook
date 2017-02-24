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

                // context.arc(
                //   centerX,       // 圆心x坐标
                //   centerY,       // 圆心y坐标
                //   radius,        // 半径
                //   starAngle,     // 开始的角度
                //   endAngle,      // 结束的角度
                //   anticlockwise  // 默认为false,顺时针
                // );

                context.lineWidth = 5;
                context.strokeStyle = '#c7254e';
                context.arc(300, 300, 50, 0, 1.5*Math.PI);
                context.stroke();
            }
        },
        mounted() {
            this.draw();
        }
    }
</script>
