<style lang="less" scoped>
    .gradient(@color) {
        background-image: linear-gradient(@color 100%, transparent 100%);
        background-size: 100% 10%;
        background-repeat: no-repeat;
        background-position: bottom center;
        &:hover {
            color: #fff;
            background-size: 100% 100%;
        }
    }
    ul {
        width: 700px;
        margin: 100px auto;
    }
    li {
        float: left;
        width: 100px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        cursor: pointer;
        &:first-child {
            .gradient(red);
        }
        &:nth-child(2) {
            .gradient(orange);
        }
        &:nth-child(3) {
            .gradient(yellow);
        }
        &:nth-child(4) {
            .gradient(green);
        }
        &:nth-child(5) {
            .gradient(blue);
        }
        &:nth-child(6) {
            // .gradient(#0ff);
            .gradient(indigo);
        }
        &:nth-child(7) {
            // .gradient(purple);
            .gradient(violet);
        }
    }
</style>

<template>
    <main>
        <ul>
            <li
                v-for="item in menus"
                :key="item"
            >
                {{ item }}
            </li>
        </ul>
    </main>
</template>

<script>
export default {
    data() {
        return {
            menus: ['菜瓜', '菜瓜', '菜瓜', '菜瓜', '菜瓜', '菜瓜', '菜瓜']
        }
    }
}
</script>
