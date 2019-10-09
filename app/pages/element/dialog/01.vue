<style lang="less" scoped>
</style>

<template>
    <main id="main">
        <button @click="toggle">toggle</button>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                isShow: false,
                dialog: null,
            }
        },
        methods: {
            init() {
                const main = document.getElementById('main');
                const dialog = document.createElement('dialog');
                dialog.innerText = 'This is a dialog !';

                this.dialog = dialog;
                main.appendChild(dialog);
            },
            toggle() {
                const { dialog } = this;
                this.isShow = !this.isShow;

                if (this.isShow) {
                    dialog.show();
                } else {
                    dialog.close();
                }
            },
        },
        mounted() {
            this.init();
        }
    }
</script>
