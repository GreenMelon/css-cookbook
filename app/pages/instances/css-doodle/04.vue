<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<template>
    <main>
        <css-doodle>
            :doodle {
                @grid: 2 / 60vmin;
            }

            --g: calc(2.5vmin / 2);
            --s: calc(50% - 2.5vmin);

            color: @pn(#36c5ef, #2db67c, #df1e5a, #ebb12d);
            transform: rotate(@pn(0, 90deg, -90deg, 180deg));

            :after, :before {
                content: '';
                position: absolute;
                top: @pn(calc(50% + var(--g)), var(--g));
                right: var(--g);
                border-radius: @pn(100vmax, 50% 50% 0);
                background: currentColor; 
                @size: @pn(calc(50% + var(--s)) var(--s), var(--s));
            }
        </css-doodle>
    </main>
</template>

<script>
    import 'css-doodle';

    export default {};
</script>
