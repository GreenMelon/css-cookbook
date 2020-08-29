<style lang="less" scoped>
@color: #007dd4;

h1 {
    font-size: 24px;
}

li {
    text-align: center;
}

p {
    display: inline-block;
    margin: 10px auto;
    font-family: serif;
    font-size: 48px;
    text-align: center;
}
p::before {
    content: "Life is but a span.";
}

.text-shadow() {
    text-shadow:
        -2px -2px white,
        -2px 2px white,
        2px -2px white,
        2px 2px white
    ;
}

.waveline(@color, @h) {
    position: relative;
    &::after {
        content: '';
        position: absolute;
        top: 90%;
        left: 0;
        display: block;
        width: 100%;
        height: @h;
        background:
            linear-gradient(135deg, transparent, transparent 45%, @color, transparent 55%, transparent 100%),
            linear-gradient(45deg, transparent, transparent 45%, @color, transparent 55%, transparent 100%);
        background-size: @h * 2 @h * 2;
    }
}


.text-decoration {
    text-decoration: underline;
}

/* hack 1st */
.border-bottom {
    border-bottom: 2px solid @color;
}
.border-bottom.close {
    line-height: 0.92;
    text-shadow:
        6px 6px white,
        6px -6px white,
        -6px 6px white,
        -6px -6px white
    ;
}

/* hack 2nd */
.box-shadow.normal {
    .text-shadow();
    background-size: 1px 1em;
    box-shadow:
        inset 0 -0.175em white,
        inset 0 -0.2em black
    ;
}
.box-shadow.color {
    box-shadow:
        0 -2px 0 2px white,
        0 0 0 2px @color
    ;
}
.box-shadow.color.close {
    .text-shadow();
    box-shadow:
        inset 0 -0.175em white,
        inset 0 -0.2em @color
    ;
}
.box-shadow.double {
    box-shadow:
        inset 0 -0.075em white,
        inset 0 -0.1em red,
        inset 0 -0.15em white,
        inset 0 -0.175em red
    ;
}

/* hack 3rd */
.background-image.solid {
    background-image: linear-gradient(to bottom, @color 33%, transparent 33%);
    background-position: 0 1.35em;
    background-repeat: repeat-x;
}
.background-image.solid.close {
    background-image: linear-gradient(to bottom, @color 33%, transparent 33%);
    background-position: 0 1.1em;
    background-repeat: repeat-x;
    background-size: 2px 6px;
}
.background-image.dashed {
    background-image: linear-gradient(to right, @color 75%, transparent 75%);
    background-position: 0 1.04em;
    background-repeat: repeat-x;
    background-size: 8px 3px;
}
.background-image.dotted {
    background-image: linear-gradient(to right, crimson 50%, transparent 50%);
    background-position: 0 1.04em;
    background-repeat: repeat-x;
    background-size: 6px 3px;
}
.background-image.double {
    background-image: linear-gradient(to bottom, crimson 33%, transparent 33%, transparent 66%, crimson 66%, crimson);
    background-position: 0 1.03em;
    background-repeat: repeat-x;
    background-size: 2px 6px;
}
.background-image.waveline {
    .waveline(@color, 10px);
}
.background-image.stars {
    background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/78779/star.svg");
    background-position: 0 1.06em;
    background-size: 10px 9px;
    background-repeat: repeat-x;
}
</style>

<template>
    <main>
        <div>
            <h1>text-decoration</h1>
            <ul>
                <li>
                    <p class="text-decoration"></p>
                </li>
            </ul>
        </div>
        <div>
            <h1>border-bottom</h1>
            <ul>
                <li>
                    <p class="border-bottom"></p>
                </li>
                <li>
                    <p class="border-bottom close"></p>
                </li>
            </ul>
        </div>
        <div>
            <h1>box-shadow</h1>
            <ul>
                <li>
                    <p class="box-shadow normal"></p>
                </li>
                <li>
                    <p class="box-shadow color"></p>
                </li>
                <li>
                    <p class="box-shadow color close"></p>
                </li>
                <li>
                    <p class="box-shadow double"></p>
                </li>
            </ul>
        </div>
        <div>
            <h1>background-image</h1>
            <ul>
                <li>
                    <p class="background-image solid"></p>
                </li>
                <li>
                    <p class="background-image solid close"></p>
                </li>
                <li>
                    <p class="background-image dashed"></p>
                </li>
                <li>
                    <p class="background-image dotted"></p>
                </li>
                <li>
                    <p class="background-image double"></p>
                </li>
                <li>
                    <p class="background-image waveline"></p>
                </li>
                <li>
                    <p class="background-image stars"></p>
                </li>
            </ul>
        </div>
        <div>
            <h1>
                <h1>
                    <a href="https://codepen.io/johndjameson/pen/JXZrqy">SVG filters</a>
                </h1>
            </h1>
        </div>
        <div>
            <h1>
                <h1>
                    <a href="https://github.com/wentin/underlineJS">underline.js</a>
                </h1>
            </h1>
        </div>
    </main>
</template>

<script>
export default {}
</script>
