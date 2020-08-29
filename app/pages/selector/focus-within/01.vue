<style lang="less" scoped>
    .parent:focus-within {
        background-color: red;
    }
</style>

<template>
    <main>
        <div class="parent">
            <input type="text">
        </div>
        <router-link to="http://caniuse.com/#search=focus-within">兼容性</router-link>
    </main>
</template>

<script>
export default {}
</script>
