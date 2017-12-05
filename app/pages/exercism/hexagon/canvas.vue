<style lang="less" scoped>

</style>

<template>
    <main>
        <ul>
            <li>
                <div>
                    <canvas id="hexagon"></canvas>
                </div>
                <pre class="pre-code">
                    <code>

                    </code>
                </pre>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {
        methods: {
            draw() {
                let canvas = document.getElementById('hexagon');
                let context = canvas.getContext('2d');

                canvas.width = 400;
                canvas.height = 400;

                context.fillStyle = '#FFF';
                context.rect(0, 0, 400, 400);
                context.fill();

                context.beginPath();
                for (let i = 0; i < 6; i++) {
                    let x =  Math.cos((i * 60) / 180 * Math.PI) * 150 + 200;
                    let y = -Math.sin((i * 60) / 180 * Math.PI) * 150 + 200;
                    context.lineTo(x, y);
                }
                context.closePath();

                context.lineWidth = 2;
                context.fillStyle = "#007DD4";
                context.fill();
            }
        },
        mounted() {
            this.draw();
        }
    }
</script>
