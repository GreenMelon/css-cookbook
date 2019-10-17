<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
}

.gradient,
.shadow {
    margin: 50px;
    width: 250px;
    height: 250px;
    border: 1px solid #000;
}

.gradient {
    background-image: linear-gradient(90deg, #000 0%, #000 50%, #fff 50%, #fff 100%);
    background-size:  100px 100px;
}

.shadow {
    position: relative;
    overflow: hidden;
    &::before {
        content: "";
        position: absolute;
        top: -50px;
        left: -50px;
        width: 50px;
        height: 50px;
        box-shadow: 
            50px 50px, 150px 50px, 250px 50px,
            50px 100px, 150px 100px, 250px 100px,
            50px 150px, 150px 150px, 250px 150px,
            50px 200px, 150px 200px, 250px 200px,
            50px 250px, 150px 250px, 250px 250px
        ;
    }
}

.shadow.animate {
    &::before {
        animation: move 3s infinite linear;
    }
}

@keyframes move {
    25% {
        transform: translate(50px);
        color: coral;
        box-shadow: 
            50px 50px, 150px 50px, 250px 50px,
            50px 100px, 150px 100px, 250px 100px,
            50px 150px, 150px 150px, 250px 150px,
            50px 200px, 150px 200px, 250px 200px,
            50px 250px, 150px 250px, 250px 250px
        ;
    }
    50% {
        transform: translate(0px);
        color: brown;
        border-radius: 0;
        box-shadow: 
            50px 50px, 150px 50px, 250px 50px,
            100px 100px, 200px 100px, 300px 100px,
            50px 150px, 150px 150px, 250px 150px,
            100px 200px, 200px 200px, 300px 200px,
            50px 250px, 150px 250px, 250px 250px
        ;
    }
    75% {
        transform: translate(0px);
        color: teal;
        border-radius: 50%;
        box-shadow: 
            50px 50px, 150px 50px, 250px 50px,
            100px 100px, 200px 100px, 300px 100px,
            50px 150px, 150px 150px, 250px 150px,
            100px 200px, 200px 200px, 300px 200px,
            50px 250px, 150px 250px, 250px 250px
        ;
    }
    100% {
        border-radius: 0%;
        box-shadow: 
            50px 50px, 150px 50px, 250px 50px,
            50px 100px, 150px 100px, 250px 100px,
            50px 150px, 150px 150px, 250px 150px,
            50px 200px, 150px 200px, 250px 200px,
            50px 250px, 150px 250px, 250px 250px
        ;
    }
}
</style>

<template>
    <main>
        <div class="gradient"></div>
        <div class="shadow"></div>
        <div class="shadow animate"></div>
    </main>
</template>

<script>
export default {}
</script>
