<style lang="less" scoped>
.demo {
    margin: 30px auto;
    width: 208px;
    height: 208px;
    border-style: solid;
    border-width: 26px;
    border-image-source: url("~images/border.png");
    background-color: orange;
    outline: 1px dashed #007DD4;
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
        <div
            class="demo"
            :style="{
                'border-image-width': `${option.width}px`,
                'border-image-slice': `${option.slice}`,
                'border-image-repeat': `${option.repeat}`,
            }"
        >
            border-image
        </div>

        <div class="setting">
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
            <p>
                <span>boborder-image-repeat:</span>
                <br>
                <input
                    v-model="option.width"
                    :min="boborderImageWidthOptions.min"
                    :max="boborderImageWidthOptions.max"
                    type="range"
                >
            </p>
        </div>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                option: {
                    width: 26,
                    slice: 26,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    repeat: 'stretch',
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
                boborderImageWidthOptions: {
                    min: 0,
                    max: 100,
                },
            };
        },
    }
</script>
