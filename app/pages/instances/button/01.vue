<style lang="sass" scoped>
$text: #382b22;
$light-pink: #fff0f0;
$pink: #ffe9e9;
$dark-pink: #f9c4d2;
$pink-border: #b18597;
$pink-shadow: #ffe3e2;

button {
    position: relative;
    display: inline-block;
    padding: 1.25em 2em;
    border: 2px solid $pink-border;
    font-weight: 600;
    text-transform: uppercase;
    text-decoration: none;
    vertical-align: middle;
    border-radius: 0.75em;
    color: $text;
    background: $light-pink;
    outline: none;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), background 150ms cubic-bezier(0, 0, 0.58, 1);
    &::before {
        position: absolute;
        content: "";
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: inherit;
        background: $dark-pink;
        box-shadow: 0 0 0 2px $pink-border, 0 0.625em 0 0 $pink-shadow;
        transform: translate3d(0, 0.75em, -1em);
        transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
    }
    &:hover {
        background: $pink;
        transform: translate(0, 0.25em);
        &::before {
            box-shadow: 0 0 0 2px $pink-border, 0 0.5em 0 0 $pink-shadow;
            transform: translate3d(0, 0.5em, -1em);
        }
    }
    &:active {
        background: $pink;
        transform: translate(0em, 0.75em);
        &::before {
            box-shadow: 0 0 0 2px $pink-border, 0 0 $pink-shadow;
            transform: translate3d(0, 0, -1em);
        }
    }
}
</style>

<template>
    <main>
        <button>Learn More</button>
    </main>
</template>

<script>
    export default {};
</script>
