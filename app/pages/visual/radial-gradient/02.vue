<style lang="less" scoped>
main {
    /* cyan */
    --sm-dot: radial-gradient(
        circle,
        hsla(190,100%,50%,1) 16px,
        hsla(190,100%,50%,0) 16px
    );

    /* blue */
    --md-dot: radial-gradient(
        circle,
        hsla(223,100%,50%,1) 18px,
        hsla(223,100%,50%,0) 18px
    );

    /* orange */
    --md2-dot: radial-gradient(
        circle,
        hsla(168,100%,50%,1) 22px,
        hsla(168,100%,50%,0) 22px
    );

    /* pink */
    --lg-dot: radial-gradient(
        circle,
        hsla(343,100%,60%,1) 24px,
        hsla(343,100%,60%,0) 24px
    );

    /* green */
    --xsm-dot: radial-gradient(
        circle,
        hsla(120,100%,40%,1) 14px,
        hsla(120,100%,40%,0) 14px
    );

    /* violet */
    --xmd-dot: radial-gradient(
        circle,
        hsla(283,100%,50%,1) 22px,
        hsla(283,100%,50%,0) 22px
    );

    /* yellow */
    --xmd2-dot: radial-gradient(
        circle,
        hsla(68,100%,60%,1) 18px,
        hsla(68,100%,60%,0) 18px
    );

    /* orange */
    --xlg-dot: radial-gradient(
        circle,
        hsla(33,100%,60%,1) 16px,
        hsla(33,100%,60%,0) 16px
    );

    --sm-size: 200px 200px;
    --md2-size: 200px 200px;
    --md-size: 200px 200px;
    --lg-size: 200px 200px;
    --xsm-size: 200px 200px;
    --xmd2-size: 200px 200px;
    --xmd-size: 200px 200px;
    --xlg-size: 200px 200px;

    --sm-pos: 0px 50px;
    --md2-pos: 0px 150px;
    --md-pos: 50px 0px;
    --lg-pos: 50px 100px;
    --xsm-pos: 100px 50px;
    --xmd2-pos: 100px 150px;
    --xmd-pos: 150px 0px;
    --xlg-pos: 150px 100px;
    background-color: hsl(243,100%,16%);

    background-image: 
        var(--sm-dot), 
        var(--md2-dot), 
        var(--md-dot), 
        var(--lg-dot),
        var(--xsm-dot), 
        var(--xmd2-dot), 
        var(--xmd-dot), 
        var(--xlg-dot)
    ;

    background-size: 
        var(--sm-size),
        var(--md2-size),
        var(--md-size),
        var(--lg-size) ,
        var(--xsm-size),
        var(--xmd2-size),
        var(--xmd-size),
        var(--xlg-size)
    ;

    background-position: 
        var(--sm-pos),
        var(--md2-pos),
        var(--md-pos),
        var(--lg-pos),
        var(--xsm-pos),
        var(--xmd2-pos),
        var(--xmd-pos),
        var(--xlg-pos)
    ;
}
</style>

<template>
    <main>
    </main>
</template>

<script>
export default {}
</script>
