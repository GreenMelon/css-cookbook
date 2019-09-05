<style lang="less" scoped>
@color: #007dd4;

p {
    margin: 20px auto;
    font-family: serif;
    font-size: 64px;
    text-align: center;
    text-decoration-color: @color;
}
p::before {
    content: "Life is but a span.";
}

.text-decoration-style::before,
.text-decoration-line::before,
.text-decoration-skip-ink::before,
.text-underline-offset::before,
.text-decoration-thickness::before {
    content: attr(class);
}

.text-decoration-style ~ .solid {
    text-decoration-line: underline;
    text-decoration-style: solid;
}
.text-decoration-style ~ .dashed {
    text-decoration-line: underline;
    text-decoration-style: dashed;
}
.text-decoration-style ~ .dotted {
    text-decoration-line: underline;
    text-decoration-style: dotted;
}
.text-decoration-style ~ .double {
    text-decoration-line: underline;
    text-decoration-style: double;
}
.text-decoration-style ~ .wavy {
    text-decoration-line: underline;
    text-decoration-style: wavy;
}

.text-decoration-line ~ .underline.overline {
    text-decoration-line: overline underline;
}
.text-decoration-line ~ .line-through {
    text-decoration-line: line-through;
}

.text-decoration-skip-ink ~ .auto {
    text-decoration-line: underline;
    text-decoration-skip-ink: auto;
}
.text-decoration-skip-ink ~ .none {
    text-decoration-line: underline;
    text-decoration-skip-ink: none;
}

.text-underline-offset,
.text-decoration-thickness {
    color: gray;
}
</style>

<template>
    <main>
        <ul>
            <li>
                <h2 class="text-decoration-style">:</h2>
                <p class="solid"></p>
                <p class="dashed"></p>
                <p class="dotted"></p>
                <p class="double"></p>
                <p class="wavy"></p>
            </li>
            <li>
                <h2 class="text-decoration-line">:</h2>
                <p class="underline overline"></p>
                <p class="line-through"></p>
            </li>
            <li>
                <h2 class="text-decoration-skip-ink">:</h2>
                <p class="auto"></p>
                <p class="none"></p>
            </li>
            <li>
                <h2 class="text-underline-offset">:</h2>
            </li>
            <li>
                <h2 class="text-decoration-thickness">:</h2>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>
