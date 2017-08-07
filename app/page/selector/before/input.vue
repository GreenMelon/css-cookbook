<style lang="less" scoped>
    input[type="text"] {
        &::before {
            content: "text";
        }
    }
    input[type="checkbox"] {
        &::before {
            content: "checkbox";
        }
    }
    input[type="radio"] {
        &::before {
            content: "radio";
        }
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <input type="text">
            </li>
            <li>
                <input type="checkbox">
            </li>
            <li>
                <input type="radio">
            </li>
        </ul>
    </main>
</template>

<script>
    export default {};
</script>
