<style lang="less" scoped>
    .containner {
        height: 75vh;
    }

    .triangle {
        // The actual clipping effect
        clip-path: url(#cp);

        // Keep it proportional
        width: 50vw;
        height: 50vw;
        max-height: 75vh;
        max-width: 75vh;

        // Add the styling
        background-size: cover;
        background-blend-mode: screen;

        // Center them
        position: absolute;
        top: 50%;
        left: 50%;
    }

    .first {
        background-color: #C5075C;
        background-image: url("/app/images/Ichi.gif");

        transform: translateX(-65%) translateY(-50%);
    }

    .second {
        background-color: #03B897;
        background-image: url("/app/images/001.gif");


        transform: translateX(-35%) translateY(-50%);

        opacity: 0.8;
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="containner">
                    <!-- Define SVG clip path -->
                    <svg width='0' height='0'>
                        <defs>
                            <clipPath id="cp" clipPathUnits="objectBoundingBox">
                                <path d="M0.500, 0.945 L0.994, 0.090 L0.006, 0.090 L0.500, 0.945 L0.500, 0.650 L0.262, 0.238 L0.738, 0.237 L0.500, 0.650z"></path>
                            </clipPath>
                        </defs>
                    </svg>

                    <!-- The actual elements we're using -->
                    <div class="triangle first"></div>
                    <div class="triangle second"></div>
                </div>
                <a href="http://codepen.io/Zeaklous/pen/mVEwje" target="_blank">view in codePen</a>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>
