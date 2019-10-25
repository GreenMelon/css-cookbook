<style lang="css" scoped>
h1 {
    --minFontSize: 32px;
    --maxFontSize: 200px;
    --scaler: 10vw;
    font-size: clamp(var(--minFontSize), var(--scaler), var(--maxFontSize));
}
</style>

<template>
    <main>
        <h1>FitText in CSS</h1>
    </main>
</template>

<script>
export default {}
</script>
