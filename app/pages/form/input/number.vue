<style lang="less" scoped>
input[type="number"] {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
}
</style>

<template>
    <main>
        <form>
            <input
                type="number"
                value="2"
                min="0"
                step="1"
            >
        </form>
    </main>
</template>

<script>
export default {}
</script>
