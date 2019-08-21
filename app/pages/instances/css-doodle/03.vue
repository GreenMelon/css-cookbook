<style lang="css" scoped>
div {
    width: 72px;
    height: 72px;
    -webkit-box-reflect: var(--reflect);
}

div:empty {
    --g: linear-gradient(#000, #000);
    --gs: linear-gradient(-45deg,
    transparent calc(
        50% - 1px), #000 calc(50% - 1px),
        #000 calc(50% + 1px), transparent calc(50% + 1px)
    );
    background:
        var(--g) 0 0/100% 2px, var(--g) 100% 0/2px 48px,
        var(--g) 100% 48px/24px 2px, var(--g) 48px 100%/2px 24px,
        var(--g) 0 100%/48px 2px, var(--g) 0 0/2px 100%,
        var(--g) 0 46px/24px 2px, var(--g) 24px 100%/2px 26px,
        var(--g) 100% 24px/26px 2px, var(--g) 46px 0/2px 24px,
        var(--gs) 50% 50% / 24px 24px,
        var(--gs) 0 0 / 40px 40px
    ;
    background-repeat: no-repeat;
}
</style>

<template>
    <main>
        <!-- https://yuanchuan.dev/2019/05/15/window-lattice-and-css.html -->

        <div style="--reflect: right calc(600% - 14px)">
            <div style="--reflect: right calc(200% - 6px)">
                <div style="--reflect: below calc(400% - 10px)">
                    <div style="--reflect: below calc(200% - 6px)">
                        <div style="--reflect: below -2px">
                            <div style="--reflect: right -2px"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import 'css-doodle';

    export default {};
</script>
