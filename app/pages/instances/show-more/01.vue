<style scoped>
.box {
    position: relative;
    margin: 10px auto;
    width: 200px;
    min-height: 200px;
    border: 1px solid #007dd4;
    text-transform: uppercase;
    line-height: 1.25;
    background-color: white;
}

.inner_box {
    height: 200px;
    padding-bottom: 1.25em;
    overflow: hidden;
}

.line {
    position: relative;
    display: block;
    height: 200px;
    background-color: white;
}

input[id="more"] {
    display: none;
}

.more {
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #c3254e;
    cursor: pointer;
}

input[id="more"]:checked ~ .inner_box {
    height: auto;
    overflow: visible;
}

input[id="more"]:checked ~ .inner_box .line {
    display: none;
}

input[id="more"]:checked ~ .more:after {
    content: "收起...";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #c3254e;
}
</style>

<template>
    <main>
        <form>
            <label
                v-for="(choice, index) in choices"
                :key="index"
                :for="index"
            >
                <input
                    v-model="repeatCount"
                    :id="index"
                    :value="choice.value"
                    type="radio"
                    name="cnt"
                >
                {{ choice.alias }}
            </label>
        </form>

        <div class="box">
            <input
                id="more"
                type="checkbox"
            >
            <label
                for="more"
                class="more"
            >
                更多...
            </label>

            <div class="inner_box">
                <p class="content">{{ content }}</p>
                <div class="line"></div>
            </div>
        </div>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                choices: [
                    {
                        value: 1,
                        alias: '内容少',
                    }, {
                        value: 10,
                        alias: '内容适中',
                    }, {
                        value: 20,
                        alias: '内容多',
                    },
                ],
                repeatCount: 1,
                baseContent: 'life is but a span. ',
            };
        },

        computed: {
            content() {
                return this.baseContent.repeat(this.repeatCount);
            },
        },
    }
</script>
