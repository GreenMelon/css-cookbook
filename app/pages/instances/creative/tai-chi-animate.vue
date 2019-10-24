<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #555;
}

@width: 24px;
@cycleDuration: 4s;

.container {
    position: relative;
    box-sizing: border-box;
    width: 16 * @width;
    height: 16 * @width;
    border-top: 8 * @width solid black;
    border-radius: 100%;
    background: white;
    animation: container-rotation 2 * @cycleDuration infinite forwards linear;
    .tai-chi {
        position: absolute;
        top: -50%;
        animation: taichi-rotation @cycleDuration infinite forwards linear;
    }
    .tai-chi.left {
        left: 0;
    }
    .tai-chi.right {
        right: 0;
    }
    @keyframes container-rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(-360deg);
        }
    }
    @keyframes taichi-rotation {
        0% {
            transform: rotate(90deg);
        }
        100% {
            transform: rotate(450deg);
        }
    }
}

.tai-chi {
    position: relative;
    display: block;
    box-sizing: border-box;
    margin: 0 auto;
    width: 8 * @width;
    height: 8 * @width;
    border-top: 4 * @width solid black;
    border-radius: 100%;
    background: white;
}

.tai-chi::before,
.tai-chi::after {
    content: '';
    position: absolute;
    top: -50%;
    width: @width;
    height: @width;
    border-radius: 100%;
}

.tai-chi::before {
    left: 0;
    border: unit(1.5 * @width, px) solid black;
    background: white;
}

.tai-chi::after {
    left: 50%;
    border: unit(1.5 * @width, px) solid white;
    background: black;
}
</style>

<template>
    <main>
        <div class="container">
            <div class="tai-chi left"></div>
            <div class="tai-chi right"></div>
        </div>
    </main>
</template>

<script>
    export default {}
</script>
