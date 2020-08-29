<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
}
.color {
    display: inline-block;
    width: 50px;
    height: 50px;
    cursor: pointer;
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
            @click="copyColor"
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

    methods: {
        copyColor(event) {
            const element = event.target;
            const style = getComputedStyle(element);
            const { backgroundColor } = style;

            const input = document.createElement('input');
            input.value = backgroundColor;
            document.body.appendChild(input);
            input.select();

            document.execCommand('copy', false. null);

            document.body.removeChild(input);
        },
    },
}
</script>
