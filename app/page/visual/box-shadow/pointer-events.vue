<style lang="less" scoped>
    div {
        margin: 30px auto;
        width: 200px;
        height: 150px;
        background-color: #ddd;
        box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.1);
        // pointer-events: none;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div @click="click($event)"></div>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {
        methods: {
            click(e) {
                console.log(e.target);
            }
        }
    };
</script>
