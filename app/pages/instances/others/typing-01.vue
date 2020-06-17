<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1d1f20;
}

h1 {
    position: relative;
    float: left;
    font-family: 'Inconsolata', Consolas, monospace;
    font-size: 4em;
    color: #d7b94c;
}

h1 span {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    border-left: .1em solid transparent;
    background: #1d1f20;
    animation:
        typing 3s steps(16) forwards,
        cursor 1s infinite
    ;
}

@keyframes typing {
    from {
        width: 100%;
    }
    to {
        width: 0;
    }
}

@keyframes cursor {
    50% {
        border-color: white;
    }
}
</style>

<template>
    <main>
        <div class="wrapper">
            <h1>Hello World<span>&nbsp;</span></h1>
        </div>
    </main>
</template>

<script>
// 打字效果
export default {};
</script>
