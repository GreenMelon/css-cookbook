<style lang="less" scoped>
    .flex-container {
        display: flex;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .flex-item {
        box-sizing: content-box;
        margin: 5px;
        padding: 5px;
        width: 60px;
        height: 50px;
        font-size: 2em;
        font-weight: bold;
        text-align: center;
        line-height: 50px;
        color: white;
    }
</style>

<template>
    <main>
        <ul
            v-for="(group, groupIndex) in groups"
            :key="groupIndex"
            :style="{ 'justify-content': group.className }"
            class="flex-container"
        >
            <li
                v-for="(item, index) in group.items"
                :key="index"
                :style="{ 'background-color': group.color }"
                class="flex-item"
            >{{ item }}
            </li>
        </ul>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                groups: [
                    {
                        className: 'flex-start',
                        color: 'tomato',
                        categories: [1, 2, 3, 4, 5],
                    }, {
                        className: 'flex-end',
                        color: 'gold',
                        categories: [1, 2, 3, 4, 5],
                    }, {
                        className: 'center',
                        color: 'deepskyblue',
                        categories: [1, 2, 3, 4, 5],
                    }, {
                        className: 'space-between',
                        color: 'lightgreen',
                        categories: [1, 2, 3, 4, 5],
                    }, {
                        className: 'space-around',
                        color: 'hotpink',
                        categories: [1, 2, 3, 4, 5],
                    }, {
                        className: 'space-evenly',
                        color: 'crimson',
                        categories: [1, 2, 3, 4, 5],
                    }
                ],
            }
        }
    };
</script>
