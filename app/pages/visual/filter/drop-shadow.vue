<style lang="less" scoped>
    .icon {
        display: inline-block;
        box-sizing: content-box;
        width: 50px;
        height: 50px;
        overflow: hidden;
    }
    .icon-original {
        background: url(~assets/icon-smile.png) no-repeat center;
    }
    .icon-shadow {
        position: relative;
        left: -50px;
        border-right: 50px solid transparent;
        background: url(~assets/icon-smile.png) no-repeat center;
        // -webkit-filter: drop-shadow(red 50px 0);
        //         filter: drop-shadow(red 50px 0);
    }

    .icon-color {
        float: left;
        margin-top: 30px;
        width: 50px;
        height: 50px;
        cursor: pointer;
    }
</style>

<template>
    <main>
        <h1>原图</h1>
        <span class="icon icon-original"></span>

        <h1>效果图</h1>
        <span class="icon">
            <em
                :style="{
                    filter: `drop-shadow(${curColor} 50px 0)`,
                }"
                class="icon icon-shadow"
            ></em>
        </span>

        <ul>
            <li
                v-for="color in colors"
                :key="color"
                :style="{
                    background: color,
                }"
                class="icon-color"
                @click="curColor = color;"
            ></li>
        </ul>
    </main>
</template>

<script>
export default {
    data() {
        return {
            curColor: '',
            colors: ['red', 'orange', 'yellow', 'green', 'teal','blue', 'purple'],
        }
    },
}
</script>
