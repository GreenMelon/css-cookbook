<style lang="less" scoped>
form {
    font-size: 30px;
}

input[type=checkbox],
input[type=radio] {
    display: none;
}

input[type=checkbox] {
    & + label::before {
        content: "\2713";
        display: inline-block;
        margin: -5px 5px 0 0;
        width: 20px;
        height: 20px;
        border: 1px solid #000;
        font-size: 20px;
        line-height: 22px;
        text-align: center;
        vertical-align: middle;
        color: transparent;
        transition: color ease .3s;
        cursor: pointer;
    }
    &:checked + label::before {
        color: #000;
    }
}

input[type=radio] {
    & + label::before {
        content: "\26AB";
        display: inline-block;
        margin: -5px 5px 0 0;
        width: 20px;
        height: 20px;
        border: 1px solid #000;
        font-size: 0;
        line-height: 20px;
        text-align: center;
        vertical-align: middle;
        border-radius: 50%;
        transition: font-size ease .3s;
        cursor: pointer;
    }
    &:checked + label::before {
        font-size: 20px;
    }
}
</style>

<template>
    <main>
        <form>
            <div
                v-for="(c, i) in controls"
                :key="i"
            >
                <input
                    :type="c.type"
                    :id="c.type + c.value"
                    :name="c.type"
                />
                <label :for="c.type + c.value">{{ c.type + c.value }}</label>
            </div>
        </form>
    </main>
</template>

<script>
export default {
    data() {
        return {
            controls: [
                {
                    type: 'checkbox',
                    value: 1,
                }, {
                    type: 'checkbox',
                    value: 2,
                }, {
                    type: 'radio',
                    value: 1,
                }, {
                    type: 'radio',
                    value: 2,
                }
            ],
        }
    },
}
</script>
