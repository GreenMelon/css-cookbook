<style lang="less" scoped>
.wrapper {
    display: grid;
    margin-bottom: 20px;
    text-align: center;
}
.wrapper1 {
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 50px 50px;
}
.wrapper2 {
    grid-template-columns: 200px 50px 100px;
    grid-template-rows: 100px 50px;
}
.wrapper3 {
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 100px 100px 100px;
    .item1 {
        grid-column-start: 1;
        grid-column-end: 4;
        // grid-column: 1 / 4;  //简写
    }
}
.wrapper4 {
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 100px 100px 100px;
    .item1 {
        grid-column-start: 1;
        grid-column-end: 3;
    }
    .item3 {
        grid-row-start: 2;
        grid-row-end: 4;
    }
    .item4 {
        grid-column-start: 2;
        grid-column-end: 4;
    }
}
.item {
    display: flex;
    align-items: center;
    justify-content: center;
}
.item1 {
    background-color: #acf4b6;
}
.item2 {
    background-color: #fce974;
}
.item3 {
    background-color: #5efffa;
}
.item4 {
    background-color: #e6b4fd;
}
.item5 {
    background-color: #1fb373;
}
.item6 {
    background-color: #f79a5c;
}
</style>

<template>
    <main>
        <div
            v-for="(group, index) in groups"
            :key="index"
            :class="`wrapper${index + 1}`"
            class="wrapper"
        >
            <div
                v-for="item in group"
                :key="item"
                :class="'item' + item"
                class="item"
            >
                {{ item }}
            </div>
        </div>
    </main>
</template>

<script>
export default {
    alias: '总览',

    data() {
        return {
            groups: [6, 6, 6, 6],
        }
    },
};
</script>
