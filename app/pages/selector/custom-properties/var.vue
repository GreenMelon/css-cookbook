<style lang="less" scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: .5em;
    width: 100%;
    height: 100px;
}
.grid .item {
    --color: #FFB74D;
    --fallback-color: #999;
    border-radius: 50%;
    background-color: var(--color, var(--fallback-color));
}

</style>

<template>
    <main> 
        <div class="grid">
            <div
                v-for="(color, index) in colors"
                :key="index"
                :style="color ? `--color: ${color}` : ''"
                class="item"
            />
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            colors: ['', '#F00', '#0F0', '#00F', 'initial'],
        }
    },
};
</script>
