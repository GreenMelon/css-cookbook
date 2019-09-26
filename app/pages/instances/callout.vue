<style scoped lang="less">
main {
    font-size: 40px;
}
input {
    display: block;
    padding: 0 .4em;
    font: inherit;
}

.callout {
    position: absolute;
    margin: .3em 0 0 -.2em;
    max-width: 14em;
    padding: .6em .8em;
    border: 1px solid rgba(0, 0, 0, 0.3);
    font-size: 75%;
    border-radius: .3em;
    background: #fed;
    box-shadow: 0.05em 0.2em 0.6em rgba(0, 0, 0, 0.2);
    transition: 0.5s cubic-bezier(0.25, 0.1, 0.3, 1.5) transform;
    transform-origin: 1.4em -.4em;      
}

.callout::before {
    content: "";
    position: absolute;
    top: -.4em;
    left: 1em;
    padding: .35em;
    border: inherit;
    border-right: 0;
    border-bottom: 0;      
    background: inherit;
    transform: rotate(45deg);
}

input:not(:focus) + .callout:not(:hover) {
    transform: scale(0);
    transition: .25s transform;
} 
</style>

<template>
    <main>
        <label>Your username:
            <input value="leaverou">
            <span class="callout">Only letters, numbers, underscores (_) and hyphens (-) allowed!</span>
        </label>
    </main>
</template>

<script>
    export default {};
</script>
