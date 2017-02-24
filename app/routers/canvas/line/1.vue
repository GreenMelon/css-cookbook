<style lang="less" scoped>

</style>

<template>
    <main>
        <nav>xxxx</nav>
        <ul>
            <li>
                <div>
                    <canvas id="canvas"></canvas>
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

                context.moveTo(100, 100);
                context.lineTo(700, 700);
                context.lineWidth = 5;
                // context.strokeStyle = '#c7254e';
                context.stroke();
            }
        },
        mounted() {
            this.draw();
        }
    }
</script>
