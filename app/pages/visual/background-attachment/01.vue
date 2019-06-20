<style lang="less" scoped>
li {
    height: 200px;
    overflow: scroll;
    background: url('~images/superman.jpg');

    margin: 10px auto;
    width: 300px;
    font-size: 48px;
    text-align: center;
    color: #FFF;
}
li div {
    height: 1000px;
}

.scroll {
    background-attachment: scroll;
}
.fixed {
    background-attachment: fixed;
}
.local {
    background-attachment: local;
}
</style>

<template>
    <main>
        <ul>
            <li class="scroll">
                <div>
                    Hello World
                </div>
            </li>
            <li class="fixed">
                <div>
                    Hello World
                </div>
            </li>
            <li class="local">
                <div>
                    Hello World
                </div>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {};
</script>
