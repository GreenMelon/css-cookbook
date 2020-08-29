<style lang="less" scoped>
    li {
        text-align: center;
    }
    button {
        position: relative;
        display: inline-block;
        min-width: 60px;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: none;
        outline: none;
        color: #fff;
        background-color: #007dd4;
        cursor: pointer;
        &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 120px;
            height: 60px;
            transform: translate(-50%, -50%);
            // pointer-events: none;
        }
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <button @click="submit($event)" type="button">submit</button>
            </li>
        </ul>
    </main>
</template>

<script>
export default {
    methods: {
        submit(e) {
            console.log(e.target);
        }
    }
}
</script>
