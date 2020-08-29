<style lang="less" scoped>
main {
    position: relative;
    padding: 0;
    overflow: hidden;
}

.image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.8);
    animation: scaleImage 5s ease-out forwards;
}

.text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-family: 'Roboto', Arial, sans-serif;
    font-size: 200px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 0.05em;
    white-space: nowrap;
    text-transform: uppercase;
    color: white;
    background-color: black;
    mix-blend-mode: multiply;
    opacity: 0;
    animation: fadeInText 3s 2s ease-out forwards;
}

@keyframes scaleImage {
    100% {
        transform: scale(1);
    }
}

@keyframes fadeInText {
    100% {
        opacity: 1;
    }
}
</style>

<template>
    <main>
        <img
            class="image"
            src="~images/blue-sky.jpg"
        >

        <h1 class="text">
            fade-in text
        </h1>
    </main>
</template>

<script>
export default {}
</script>
