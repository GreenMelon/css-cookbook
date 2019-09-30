<style lang="css">
@import url("https://fonts.googleapis.com/css?family=Luckiest+Guy&display=swap");
</style>

<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-family: "Luckiest Guy", cursive;
    background: radial-gradient(
        circle,
        rgba(255, 252, 0, 1) 0%,
        rgba(240, 237, 23, 1) 100%
    );
}

h1 {
    margin: 0;
    padding: 0;
    font-size: 8em;
    color: white;
    text-shadow:
        0 0.1em 20px rgba(0, 0, 0, 1),
        0.05em -0.03em 0 rgba(0, 0, 0, 1),
        0.05em 0.005em 0 rgba(0, 0, 0, 1),
        0em 0.08em 0 rgba(0, 0, 0, 1),
        0.05em 0.08em 0 rgba(0, 0, 0, 1),
        0px -0.03em 0 rgba(0, 0, 0, 1),
        -0.03em -0.03em 0 rgba(0, 0, 0, 1),
        -0.03em 0.08em 0 rgba(0, 0, 0, 1),
        -0.03em 0 0 rgba(0, 0, 0, 1)
    ;
    span {
        display: inline-block;
        transform: scale(0.9);
    }
    span:first-child {
        animation: bopA 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards infinite alternate;
    }
    span:last-child {
        animation: bopB 1s 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards infinite alternate;
    }

    @keyframes bopA {
        0% {
            transform: scale(0.9);
        }
        50%,
        100% {
            transform: scale(1);
        }
    }

    @keyframes bopB {
        0% {
            transform: scale(0.9);
        }
        80%,
        100% {
            transform: scale(1) rotateZ(-3deg);
        }
    }
}
</style>

<template>
    <main>
        <h1>
            <span>"green</span>
            <span>melon"</span>
        </h1>
    </main>
</template>

<script>
    export default {}
</script>
