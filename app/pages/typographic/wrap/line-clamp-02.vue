<style lang="less" scoped>
main {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.5;
}

.box {
    width: 200px;
    padding: 2em;
    border: 2px solid #246756;
}

.box p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
}
</style>

<template>
    <main>
        <div class="box">
            <p>Hey, don't cut me off like that. I want to speak my mind and don't appreciate being put into a box.</p>
        </div>
    </main>
</template>

<script>
export default {}
</script>
