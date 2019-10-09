<style lang="less" scoped>
ul {
    display: flex;
}

ul li {
    margin: 10px;
    width: 100px;
    text-align: center;
    color: white;
    background-color: crimson;
}
</style>

<template>
    <main>
        <ul>
            <li
                v-for="(item, index) in list"
                :key="index"
                :style="{
                    order: item.order,
                }"
            >
                {{ item.name }}
            </li>
        </ul>
    </main>
</template>

<script>
export default {
    data() {
        return {
            list: [
                {
                    name: '0',
                    order: 0,
                }, {
                    name: '1',
                    order: 1,
                }, {
                    name: '2',
                    order: 2,
                }, {
                    name: '3',
                    order: 1,
                },
            ],
        }
    },
}
</script>
