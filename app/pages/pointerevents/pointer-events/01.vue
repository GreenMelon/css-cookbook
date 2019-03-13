<style lang="less" scoped>
    .disable {
        pointer-events: none;
    }
</style>

<template>
    <main>
        <button
            id="btn"
            @click="disableBtn">click me
        </button>
    </main>
</template>

<script>
    export default {
        mounted() {
            this.getBtn();
        },

        methods: {
            getBtn() {
                const { left, top } = btn.getBoundingClientRect();

                const element = document.elementFromPoint(left, top);
                console.log({ element }); //btn

                const elements = document.elementsFromPoint(left, top);
                console.log({ elements }); //从里到外 
            },
            disableBtn() {
                btn.classList.add('disable');

                this.getBtn();
            },
        },
    };
</script>
