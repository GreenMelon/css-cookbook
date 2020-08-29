<style lang="less" scoped>
.container {
    padding: 30px 0 0 60px;
    perspective: 1000px;
    transform: perspective(1000px);
}

.cards {
    position: relative;
    &:hover {
        .front {
            transform: rotateY(0deg);
        }
        .back {
            transform: rotateY(180deg);
        }
    }
}

.card {
    position: absolute;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    transition: all 0.5s ease;
}

.front {
    transform: rotateY(-180deg);
}
</style>

<template>
    <main>
        <div class="container">
            <div class="cards">
                <div class="card back">
                    <img width="200" src="~images/poker-back.png" alt="">
                </div>
                <div class="card front">
                    <img width="200" src="~images/poker-front.png" alt="">
                </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {}
</script>
