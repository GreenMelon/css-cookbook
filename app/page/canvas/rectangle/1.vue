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

                context.lineWidth = 5;
                context.strokeRect(10, 10, 50, 50);
                // context.fillRect(10, 10, 50, 50);

            }
        },
        mounted() {
            this.draw();
        }
    }
</script>
