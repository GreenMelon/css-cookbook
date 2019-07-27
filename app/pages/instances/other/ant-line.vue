<style lang="less" scoped>
.ant-line {
    position: relative;
    display: inline-block;
    min-width: 10px;
    min-height: 10px;
    padding: 10px;
    border: 0;
    overflow: hidden;
    font-size: 2em;
    outline: 0;
    resize: both;
}

.ant-line::before,
.ant-line::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: border-dance .76s infinite linear;
}

.ant-line::before {
    background: linear-gradient(to right, #FFF 50%, #666 50%);
    background-size: 8px 1px;
    clip-path: polygon(
        0 0, 100% 0,
        100% 1px, 0 1px,
        0 calc(~'100% - 1px'), 100% calc(~'100% - 1px'),
        100% 100%, 0 100%
    );
}

.ant-line::after {
    background: linear-gradient(to bottom, #FFF 50%, #666 50%);
    background-size: 1px 8px;
    clip-path: polygon(
        0 0, 0 100%,
        1px 100%, 1px 0,
        calc(~'100% - 1px') 0, calc(~'100% - 1px') 100%,
        100% 100%, 100% 0
    );
}

@keyframes border-dance {
    100% {
        background-position: 8px 8px;
    }
}
</style>

<template>
    <main>
        <div
            class="ant-line"
            contenteditable="true"
        >
            Resize me
        </div>
    </main>
</template>

<script>
    export default {};
</script>
