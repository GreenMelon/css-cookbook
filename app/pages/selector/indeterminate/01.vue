<style lang="less" scoped>
    label {
        display: inline-block;
        padding: 4px;
        font-size: 36px;
        border-radius: 4px;
        background: green;
        cursor: pointer;
    }
    :indeterminate + label {
        background: crimson;
    }
</style>

<template>
    <main>
        <div>
            <h1>复选框</h1>
            <br>
            <input
                type="checkbox"
                id="indeterminate-choice"
                class="indeterminate-choice"
                indeterminate
            >
            <label for="indeterminate-choice">I agree with the Terms &amp; Conditions</label>
        </div>
    </main>
</template>

<script>
export default {
    mounted() {
        this.init();
    },
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
}
</script>
