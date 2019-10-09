<style lang="less" scoped>
main {
    position: relative;
}

dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: default;
    pointer-events: none;
}

dialog::backdrop {
    background-color: rgba(46, 164, 227, 0.8);
    cursor: pointer;
    pointer-events: all;
}
</style>

<template>
    <main>
        <button
            @click="openDialog"
        >
            Open
        </button>

        <dialog
            id="dialog"
            @click="closeDialog"
        >
            Modal: click backdrop to close.
        </dialog>
    </main>
</template>

<script>
export default {
    methods: {
        openDialog() {
            window.dialog.showModal();
        },
        closeDialog(event) {
            const rect = event.target.getBoundingClientRect();

            if (
                rect.left > event.clientX
                || rect.right < event.clientX
                || rect.top > event.clientY
                || rect.bottom < event.clientY
            ) {
                window.dialog.close();
            }
        },
    },
}
</script>
