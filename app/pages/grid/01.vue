<style lang="less">
.masonry-with-columns {
    columns: 6 200px;
    column-gap: 1rem;
    div {
        break-inside: avoid;
        margin: 0 1rem 1rem 0;
        width: 100%;
        text-align: center;
        color: white;
        background: #EC985A;
    }
}
</style>

<template>
    <main>
        <div class="masonry-with-columns">
            <div
                v-for="(index) in count"
                :key="index"
                :style="{
                    height: getRandomHeight(),
                }"
            >
                {{ index }}
            </div>
        </div>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                count: 15,
            }
        },
        methods: {
            getRandomHeight() {
                const height = `${Math.random() * 200 + 300}px`;
                return height;
            },
        },
    };
</script>
