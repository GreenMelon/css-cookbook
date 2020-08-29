<style lang="less" scoped>
    img {
        width: 400px;
    }
    .svg-filter {
        filter: url(#change);
    }
</style>

<template>
    <main>
        <svg
            height="0"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="change">
                    <feColorMatrix
                        type="matrix"
                        values="
                            3 -1 -1 0 0
                            -1 3 -1 0 0 
                            -1 -1 3 0 0 
                            0 0 0 1 0"
                    />
                </filter>
            </defs>
        </svg>

        <img src="~images/blue-sky.jpg" alt="">
        <img src="~images/blue-sky.jpg" alt="" class="svg-filter">
    </main>
</template>

<script>
export default {}
</script>
