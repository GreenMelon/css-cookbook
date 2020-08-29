<style lang="less" scoped>
.sticker {
    position: relative;
    cursor: pointer;

    .shadow {
        opacity: 0.05;
        filter: brightness(0%);
    }

    .decal {
        position: absolute;
        width: 200px;
        height: 200px;
    }

    .left {
        clip-path: inset(0px 100px 0px 0px);
    }

    .right {
        clip-path: inset(0px 0px 0px 100px);
        transform: perspective(300px) rotateY(0deg);
        transition: 200ms ease-in-out;
    }

    &:hover .right {
        filter: brightness(98%);
        transform: perspective(300px) rotateY(-50deg);
        transition: 200ms ease-in-out;
    }
}
</style>

<template>
    <main>
        <div class="sticker">
            <img
                class="decal shadow"
                src="https://res.cloudinary.com/dsvdhggfk/image/upload/v1568737524/sticker_ura9hj.webp"
                alt=""
            >
            <img
                class="decal left"
                src="https://res.cloudinary.com/dsvdhggfk/image/upload/v1568737524/sticker_ura9hj.webp"
                alt=""
            >
            <img
                class="decal right"
                src="https://res.cloudinary.com/dsvdhggfk/image/upload/v1568737524/sticker_ura9hj.webp"
                alt=""
            >
        </div>
    </main>
</template>

<script>
export default {}
</script>
