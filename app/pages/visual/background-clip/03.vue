<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
}

.demo {
    display: inline-block;
    width: 220px;
    height: 60px;
    padding: 8px;
    border: 4px solid transparent;
    text-align: center;
    border-radius: 10px;
    background:
        linear-gradient(#B7D3F0, #6B90EE) content-box,
        linear-gradient(#c769c2, #211A4D) padding-box,
        linear-gradient(#F1F48C, #8BE5DC) border-box
    ;
}
</style>

<template>
    <main>
        <div class="demo"></div>
    </main>
</template>

<script>
export default {}
</script>
