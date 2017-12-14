<style scoped>
    button {
        font-size: 24px;
        cursor: pointer;
    }
</style>

<template>
    <main>
        <h1>Index</h1>
        <ul>
            <li v-for="(item, index) in list">
                {{ item }}
                <button @click="update(index)">save</button>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                list: [1, 2, 4]
            }
        },
        methods: {
            update(index) {
                this.$set(this.list, index, 0);
            }
        },
        mounted() {
            console.log(111, this.$router);
        },
    }
</script>
