<style lang="less" scoped>
.demo {
    margin: 30px auto;
    width: 208px;
    height: 208px;
    border-style: solid;
    border-width: 26px;
    border-image-source: url("~images/border.png");
    background-color: orange;
    outline: 1px dashed green;
}

.setting {
    display: flex;
    justify-content: center;
}

p {
    margin: 0 50px;
    font-size: 18px;
}

label {
    cursor: pointer;
}

input {
    margin-right: 4px;
    cursor: pointer;
}
</style>

<template>
    <main>
        <!-- border-image: source slice / width / outset repeat -->
        <div
            class="demo"
            :style="{
                'border-image-slice': getAttribute('slice', ''),
                'border-image-width': getAttribute('width', 'px'),
                'border-image-outset': getAttribute('outset', 'px'),
                'border-image-repeat': `${option.repeat}`,
            }"
        >
            border-image
        </div>

        <div class="setting">
            <p>
                <span>boborder-image-slice:</span>
                <ul>
                    <li
                        v-for="(dir, index) in directions"
                        :key="index"
                    >
                        <input
                            v-model="option.slice[dir]"
                            :min="boborderImageSliceOptions.min"
                            :max="boborderImageSliceOptions.max"
                            type="range"
                        >
                    </li>
                </ul>
            </p>

            <p>
                <span>boborder-image-width:</span>
                <ul>
                    <li
                        v-for="(dir, index) in directions"
                        :key="index"
                    >
                        <input
                            v-model="option.width[dir]"
                            :min="boborderImageWidthOptions.min"
                            :max="boborderImageWidthOptions.max"
                            type="range"
                        >
                    </li>
                </ul>
            </p>

            <p>
                <span>boborder-image-outset:</span>
                <ul>
                    <li
                        v-for="(dir, index) in directions"
                        :key="index"
                    >
                        <input
                            v-model="option.outset[dir]"
                            :min="boborderImageOutsetOptions.min"
                            :max="boborderImageOutsetOptions.max"
                            type="range"
                        >
                    </li>
                </ul>
            </p>

            <p>
                <span>boborder-image-repeat:</span>
                <ul>
                    <li
                        v-for="(item, index) in boborderImageRepeatOptions"
                        :key="index"
                    >
                        <label>
                            <input
                                v-model="option.repeat"
                                :value="item"
                                name="repeat"
                                type="radio"
                            >{{ item }}
                        </label>
                    </li>
                </ul>
            </p>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            option: {
                width: {
                    top: 26,
                    right: 26,
                    bottom: 26,
                    left: 26,
                },
                outset: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                slice: {
                    top: 26,
                    right: 26,
                    bottom: 26,
                    left: 26,
                },
                repeat: 'stretch',
            },
            directions: [
                'top',
                'right',
                'bottom',
                'left',
            ],
            boborderImageSliceOptions: {
                min: 0,
                max: 100,
            },
            boborderImageWidthOptions: {
                min: 0,
                max: 100,
            },
            boborderImageOutsetOptions: {
                min: 0,
                max: 26,
            },
            boborderImageRepeatOptions: [
                'stretch',
                'round',
                'repeat',
                'space',
                'stretch round',
                'stretch repeat',
                'stretch space',
                'round stretch',
                'round repeat',
                'round space',
                'repeat stretch',
                'repeat round',
                'repeat space',
                'space stretch',
                'space round',
                'space repeat',
            ],
        };
    },

    computed: {},

    methods: {
        getAttribute(attr, unit) {
            const  {
                top,
                right,
                bottom,
                left,
            } = this.option[attr];

            return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
        },
    },
}
</script>
