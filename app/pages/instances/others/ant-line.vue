<style lang="less" scoped>
/* 第一种实现 */
.ant-line-1 {
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

.ant-line-1::before,
.ant-line-1::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: border-dance .76s infinite linear;
}

.ant-line-1::before {
    background: linear-gradient(to right, #FFF 50%, #666 50%);
    background-size: 8px 1px;
    clip-path: polygon(
        0 0, 100% 0,
        100% 1px, 0 1px,
        0 calc(~'100% - 1px'), 100% calc(~'100% - 1px'),
        100% 100%, 0 100%
    );
}

.ant-line-1::after {
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

/* 第二种实现 */
.ant-line-2 {
    position: relative;
    width: 200px;
    height: 100px;
    text-align: center;
    background: #FFF;
}

.ant-line-2::before,
.ant-line-2::after {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(45deg, transparent, transparent 10px, #000, #000 14px);
}

.ant-line-2::before {
    clip-path: polygon(
        0 0, 100% 0,
        100% 1px, 1px 1px,
        1px 100%, 0 100%
    );
    animation: animate-before 10s infinite linear;
}

.ant-line-2::after {
    clip-path: polygon(
        calc(~'100% - 1px') 0, 100% 0,
        100% 100%, 0 100%,
        0 calc(~'100% - 1px'), calc(~'100% - 1px') calc(~'100% - 1px')
    );
    animation: animate-after 10s infinite linear;
}

@keyframes animate-before {
    from {}
    to {
        background-position: 200px 0;
    }
}
@keyframes animate-after {
    from {}
    to {
        background-position: -200px 0;
    }
}
</style>

<template>
    <main>
        <div
            class="ant-line-1"
            contenteditable="true"
        >
            Resize me
        </div>

        <div class="ant-line-2" />
    </main>
</template>

<script>
// 蚂蚁线
export default {}
</script>
