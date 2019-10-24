<style lang="less" scoped>
main {
    position: relative;
    overflow: hidden;
}

.blurred {
    position: absolute;
    top: -40px;
    right: -40px;
    bottom: -40px;
    left: -40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(https://res.cloudinary.com/inventorylab/image/upload/v1571836192/IMG_0152_rfi1he.jpg);
    background-size: 1512px 2016px;
    background-position: center -300px;
    background-attachment: fixed;
    filter: blur(20px);
}

.overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,.6);
}

.sharp {
    position: absolute;
    top: 124px;
    left: 344px;
    margin: -100px 0 0 -100px;
    width: 200px;
    height: 200px;
    border-radius: 100%;
    background-image: url(https://res.cloudinary.com/inventorylab/image/upload/v1571836192/IMG_0152_rfi1he.jpg);
    background-size: 1512px 2016px;
    background-position: center -340px;
    background-attachment: fixed;
    box-shadow: inset 0 0 0 5px white, 0 0 20px rgba(0,0,0,.2);
}
</style>

<template>
    <main>
        <div class="blurred"></div>
        <div class="overlay"></div>
        <div
            class="sharp"
            @mousemove="move"
        >
        </div>
    </main>
</template>

<script>
export default {
    methods: {
        move(evt) {
            const element = evt.target;
            element.style.left = `${evt.pageX-268}px`;
            element.style.top = `${evt.pageY}px`;
        },
    },
}
</script>
