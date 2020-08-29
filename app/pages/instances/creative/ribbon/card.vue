<style lang="css" scoped>
@import url(https://fonts.googleapis.com/css?family=Lato:700);

main {
    display: flex;
    justify-content: center;
    align-items: center;
}

.box {
    position: relative;
    max-width: 600px;
    width: 90%;
    height: 400px;
    background: #fff;
    box-shadow: 0 0 15px rgba(0, 0, 0, .1);
}

/* common */
.ribbon {
    position: absolute;
    width: 150px;
    height: 150px;
    overflow: hidden;
}
.ribbon::before,
.ribbon::after {
    content: "";
    position: absolute;
    display: block;
    border: 5px solid #2980b9;
}
.ribbon span {
    position: absolute;
    display: block;
    width: 225px;
    padding: 15px 0;
    font: 700 18px/1 'Lato', sans-serif;
    text-align: center;
    text-transform: uppercase;
    text-shadow: 0 1px 1px rgba(0,0,0,.2);
    color: #fff;
    background-color: #3498db;
    box-shadow: 0 5px 10px rgba(0,0,0,.1);
}

/* top left */
.ribbon-top-left {
    top: -10px;
    left: -10px;
}
.ribbon-top-left::before,
.ribbon-top-left::after {
    border-top-color: transparent;
    border-left-color: transparent;
}
.ribbon-top-left::before {
    top: 0;
    right: 0;
}
.ribbon-top-left::after {
    bottom: 0;
    left: 0;
}
.ribbon-top-left span {
    right: -25px;
    top: 30px;
    transform: rotate(-45deg);
}

/* top right */
.ribbon-top-right {
    top: -10px;
    right: -10px;
}
.ribbon-top-right::before,
.ribbon-top-right::after {
    border-top-color: transparent;
    border-right-color: transparent;
}
.ribbon-top-right::before {
    top: 0;
    left: 0;
}
.ribbon-top-right::after {
    right: 0;
    bottom: 0;
}
.ribbon-top-right span {
    top: 30px;
    left: -25px;
    transform: rotate(45deg);
}

/* bottom left */
.ribbon-bottom-left {
    bottom: -10px;
    left: -10px;
}
.ribbon-bottom-left::before,
.ribbon-bottom-left::after {
    border-bottom-color: transparent;
    border-left-color: transparent;
}
.ribbon-bottom-left::before {
    right: 0;
    bottom: 0;
}
.ribbon-bottom-left::after {
    top: 0;
    left: 0;
}
.ribbon-bottom-left span {
    right: -25px;
    bottom: 30px;
    transform: rotate(225deg);
}

/* bottom right */
.ribbon-bottom-right {
    right: -10px;
    bottom: -10px;
}
.ribbon-bottom-right::before,
.ribbon-bottom-right::after {
    border-bottom-color: transparent;
    border-right-color: transparent;
}
.ribbon-bottom-right::before {
    bottom: 0;
    left: 0;
}
.ribbon-bottom-right::after {
    top: 0;
    right: 0;
}
.ribbon-bottom-right span {
    bottom: 30px;
    left: -25px;
    transform: rotate(-225deg);
}
</style>

<template>
    <main>
        <div class="box">
            <div class="ribbon ribbon-top-left">
                <span>ribbon</span>
            </div>
            <div class="ribbon ribbon-top-right">
                <span>ribbon</span>
            </div>
            <div class="ribbon ribbon-bottom-left">
                <span>ribbon</span>
            </div>
            <div class="ribbon ribbon-bottom-right">
                <span>ribbon</span>
            </div>
        </div>
    </main>
</template>

<script>
export default {}
</script>
