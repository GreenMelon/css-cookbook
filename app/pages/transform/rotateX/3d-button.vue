<style lang="less" scoped>
main {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #313131;
}

.btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    height: 50px;
    line-height: 50px;
    text-align: center;
    text-decoration: none;
    transition: all .3s ease-out;
}

.text {
    padding: 0 50px;
    visibility: hidden;
}

.flip-front, 
.flip-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid #313131;
    transform-style: flat;
    transition: transform .3s ease-out;
}

.flip-front {
    color: #313131;
    background-color: transparent;
    transform: rotateX(0deg) translateZ(25px);
}

.flip-back {
    color: #fff;
    background-color: #313131;
    transform: rotateX(90deg) translateZ(25px);
}

.btn:hover {
    .flip-front {
        transform: rotateX(-90deg) translateZ(25px);
    }
    .flip-back {
        transform: rotateX(0deg) translateZ(25px);
    }
}
</style>

<template>
    <main>
        <a href="#" class="btn">
            <span class="text">text</span>
            <span class="flip-front">front</span>
            <span class="flip-back">back</span>
        </a>
    </main>
</template>

<script>
    export default {};
</script>
