<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
}
.color {
    display: inline-block;
    width: 50px;
    height: 50px;
}
</style>

<template>
    <main>
        <div
            v-for="(color, index) in colors"
            :key="index"
            class="color"
            :style="{
                backgroundColor: `var(--${color})`,
            }"
        ></div>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                colors: [
                    'red',
                    'pink',
                    'purple',
                    'deepPurple',
                    'indigo',
                    'blue',
                    'lightBlue',
                    'cyan',
                    'teal',
                    'green',
                    'lightGreen',
                    'lime',
                    'yellow',
                    'amber',
                    'orange',
                    'deepOrange',
                    'brown',
                    'grey',
                    'blueGrey'
                ],
            };
        },
    };
</script>
