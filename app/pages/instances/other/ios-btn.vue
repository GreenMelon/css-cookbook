<style scoped lang="less">
    .btn-toggle {
        position: relative;
        box-sizing: border-box;
        width: 36px;
        height: 18px;
        border: none;
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
        &::before,
        &::after {
            content: "";
            position: absolute;
        }
        &::before {
            width: 100%;
            height: 100%;
            border-radius: 9px;
            background: #6c717a;
            transition: background .2s;
        }
        &::after {
            top: 50%;
            left: 3px;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #fff;
            transition: left .2s;
        }
        &:checked {
            &::before {
                background: #38a2fb;
            }
            &::after {
                left: 21px;
            }
        }
    }
</style>

<template>
    <main>
        <input
            v-model="isChecked"
            class="btn-toggle"
            type="checkbox"
        >
    </main>
</template>

<script>
    export default {
        data() {
            return {
                isChecked: false,
            };
        },
    };
</script>
