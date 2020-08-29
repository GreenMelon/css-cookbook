<style lang="less" scoped>
@import url('https://fonts.googleapis.com/css?family=Pacifico&display=swap');

main {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
}

.svg {
    position: absolute;
    width: 0;
    height: 0;
}

.clipped {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 500px;
    height: 500px;

    &::before,
    &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        clip-path: url(#my-clip-path);
    }
    &::before {
        border-radius: 170px;
        box-shadow: 
            0 0 15px 10px crimson inset,
            0 0 15px 20px purple inset,
            0 0 10px 30px teal inset,
            0 0 10px 40px turquoise inset,
            0 0 10px 50px yellowgreen inset,
            0 0 5px 60px gold inset,
            0 0 10px 70px yellow inset,
            0 0 15px 80px orange inset,
            0 0 15px 90px orangered inset
        ;
    }

    &::after {
        margin: 90px;
        background: #333;
        opacity: .45;
    }
}

.clipped__content {
    position: relative;
    z-index: 1;
    max-width: 60%;
    font-family: 'Pacifico', sans-serif;
    font-size: 35px;
    text-align: center;
    color: #FFF;
}
</style>

<template>
    <main>
        <svg class="svg">
            <clipPath
                id="my-clip-path"
                clipPathUnits="objectBoundingBox"
            >
                <path d="M0.065,0.201, C0.07,0.17,0.069,0.109,0.105,0.087, C0.13,0.073,0.161,0.076,0.187,0.064, C0.223,0.047,0.356,-0.059,0.388,0.046, C0.429,0.186,0.177,0.245,0.126,0.281, C0.089,0.307,0.074,0.36,0.037,0.386, C-0.008,0.416,-0.008,0.373,0.016,0.299, C0.025,0.27,0.045,0.247,0.06,0.221, L0.065,0.201, M0.576,0.037, C0.548,0.089,0.534,0.153,0.492,0.193, C0.453,0.23,0.392,0.23,0.346,0.258, C0.324,0.272,0.314,0.303,0.292,0.316, C0.146,0.4,0.162,0.346,0.08,0.455, C0.051,0.495,-0.01,0.549,0.044,0.609, C0.154,0.732,0.288,0.449,0.364,0.388, C0.416,0.347,0.49,0.413,0.537,0.367, C0.57,0.336,0.67,0.105,0.674,0.103, C0.701,0.086,0.738,0.115,0.767,0.103, C0.779,0.098,0.776,0.075,0.769,0.064, C0.756,0.046,0.734,0.038,0.714,0.028, C0.671,0.007,0.656,0.015,0.61,0.018, L0.576,0.037, M0.789,0.138, C0.757,0.223,0.738,0.271,0.733,0.282, C0.673,0.413,0.6,0.384,0.494,0.428, C0.446,0.448,0.388,0.473,0.325,0.535, C0.279,0.582,0.24,0.636,0.192,0.681, C0.184,0.689,-0.069,0.786,0.066,0.845, C0.297,0.948,0.462,0.795,0.629,0.65, C0.716,0.575,0.787,0.557,0.841,0.452, C0.893,0.35,1.008,0.181,0.914,0.067, C0.91,0.062,0.992,0.085,0.896,0.062, C0.833,0.048,0.797,0.073,0.789,0.138, M0.96,0.422, C0.819,0.473,0.882,0.694,0.773,0.769, C0.715,0.809,0.651,0.838,0.584,0.859, C0.484,0.892,0.378,0.898,0.277,0.928, C0.241,0.939,0.19,0.947,0.178,0.983, C0.169,1.008,0.227,0.998,0.253,0.998, C0.301,1,0.35,0.999,0.398,0.991, C0.575,0.962,0.418,0.961,0.593,0.898, C0.742,0.845,0.723,0.917,0.856,0.763, C0.904,0.709,1.055,0.531,0.979,0.447, L0.96,0.422, M0.899,0.822, C0.87,0.855,0.775,0.9,0.812,0.922, L0.801,0.977, C0.825,0.991,1.019,0.947,0.974,0.887, C0.956,0.862,0.928,0.848,0.905,0.829, L0.899,0.822"></path>
            </clipPath>
        </svg>

        <div class="clipped">
            <div class="clipped__content">Clip-path magic</div>
        </div>
    </main>
</template>

<script>
export default {}
</script>
