<style lang="less" scoped>
main {
    background-image: url(http://www.bryanjones.us/sites/default/files/stars.png);
    background-color: #000;
}

.mars {
    position: relative;
    top: 50px;
    left: 50px;
    width: 250px;
    height: 250px;
    border-radius: 100%;
    background: linear-gradient(
            to top right,
             #000000,
             #020101,
             #140501,
             #24070B,
             #37060E,
             #460011,
             #560817,
             #8B0019,
             #93001A,
             #A40017,
             #A90019,
             #B00019,
             #CC001B,
             #DC0019,
             #EC0019,
             #FF0023,
             #FF0033,
             #FF0040,
             #FF9CAE,
             #FFCCCF,
             #FDDDDF,
             #FF0032,
             #EEE0E4
    );
    box-shadow: -20px -5px 60px -15px #EEE inset;
}
</style>

<template>
    <main>
        <div class="mars"></div>
    </main>
</template>

<script>
    export default {};
</script>
