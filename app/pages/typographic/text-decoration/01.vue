<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

p {
    margin: 0 50px;
    font-family: serif;
    font-size: 48px;
    text-align: center;
}
p::before {
    content: "Life is but a span.";
}

/* option 1st */
.border-bottom {
    display: inline-block;
    border-bottom: 2px solid purple;
}
.border-bottom.close {
    line-height: 0.8;
}

/* option 2nd */
.box-shadow {
    box-shadow:
        0 -2px 0 2px white,
        0 0 0 2px purple
    ;
}

/* option 3rd */
.background-image {
    background-image: linear-gradient(to bottom, red 33%, transparent 33%);
    background-position: 0 1.35em;
    background-repeat: repeat-x;
}
.background-image.close {
    background-image: linear-gradient(to bottom, red 33%, transparent 33%);
    background-position: 0 1.1em;
    background-repeat: repeat-x;
    background-size: 2px 6px;
}
</style>

<template>
    <main>
        <p class="border-bottom"></p>

        <p class="box-shadow"></p>

        <p class="background-image"></p>

        <p class="border-bottom close"></p>

        <p class="box-shadow close"></p>

        <p class="background-image close"></p>
    </main>
</template>

<script>
    export default {}
</script>
