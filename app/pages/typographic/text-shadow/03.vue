<style lang="sass" scoped>
@function makeLongShadow($color) {
    $val: 0px 0px $color;

    @for $i from 1 through 50 {
        $val: #{$val}, #{$i}px #{$i}px #{$color};
    }

    @return $val;
}

@function makeLongFadeShadow($color) {
    $val: 0px 0px $color;
    @for $i from 1 through 50 {
        $color: fade-out(desaturate($color, 1%), .02);
        $val: #{$val}, #{$i}px #{$i}px #{$color};
    }
    @return $val;
}

div {
    font-size: 20vmin;
    line-height: 45vh;
    text-align: center;
    color: hsl(14, 100%, 60%);
}

.demo1 {
    text-shadow: makeLongShadow(hsl(14, 100%, 30%));
}

.demo2 {
    text-shadow: makeLongFadeShadow(hsla(14, 100%, 30%, 1));
}
</style>

<template>
    <main>
        <div class="demo1">NETFIX</div>
        <div class="demo2">NETFIX</div>
    </main>
</template>

<script>
export default {}
</script>
