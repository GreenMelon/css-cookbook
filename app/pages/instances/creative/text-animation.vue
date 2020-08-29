<style lang="sass" scoped>
$words: 'love', 'and', 'peace';

main {
    display: grid;
    height: 100vh;
    place-content: center;
}

h1 {
    position: relative;
    font-size: 10vw;

    &::before {
        content: nth($words, 1);
        color: #FDD835;
        text-shadow: 0 10px 20px rgba(black, 0.1);
        animation: text #{length($words) / 4}s ease infinite;
    }
}

@keyframes text {
    @for $i from 1 through length($words) {
        #{$i * 100 / length($words)}% {
            content: nth($words, $i);
        }
    }
}
</style>

<template>
    <main>
        <h1></h1>
    </main>
</template>

<script>
export default {}
</script>
