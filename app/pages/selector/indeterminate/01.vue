<style lang="less" scoped>
    input:indeterminate + label {
        color: red;
    }

    progress:indeterminate {
        border: 1px solid orange;
    }
</style>

<template>
    <main>
        <div>
            <h1>复选框</h1>
            <p>
                <input id="checkboxId" type="checkbox" indeterminate="true">
                <label for="checkboxId">Checkbox</label>
            </p>
        </div>

        <div>
            <h1>进度条</h1>
            <p>
                <progress /><br>
                <progress value="15"/><br>
                <progress value="10" max="20"/>
            </p>
        </div>
    </main>
</template>

<script>
    export default {
        methods: {
            init() {
                const input = document.querySelector('input');

                console.log({
                    indeterminate: input.indeterminate,
                    checked: input.checked,
                });

                input.indeterminate = true;

                console.log({
                    indeterminate: input.indeterminate,
                    checked: input.checked,
                });
            },
        },
        mounted() {
            this.init();
        },
    };
</script>
