<style lang="less" scoped>
.saying {
    font-size: 36px;
    // quotes: "(" ")";
    &::before {
        content: open-quote;
    }
    &::after {
        content: close-quote;
    }
}
</style>

<template>
    <main>
        <div class="saying">所爱隔山海，山海皆可平</div>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                references: [
                    'https://github.com/dwqs/blog/issues/28'
                ],
            };
        },
    };
</script>
