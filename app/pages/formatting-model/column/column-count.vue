<style lang="less" scoped>
    div {
        font-size: 16px;
        -webkit-column-count: 4;
           -moz-column-count: 4;
                column-count: 4;
    }
</style>

<template>
    <main>
        <div>
            <p
                v-for="i in 4"
                :key="i">{{ text }}
            </p>
        </div>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                text: 'hello darkness my old friend, i have come to talk with you again.'
            };
        },
    };
</script>
