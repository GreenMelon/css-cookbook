<style lang="less" scoped>
    #clip-zone {
        margin-top: 30px;
        min-height: 300px;
        padding: 10px;
        border: 2px dashed #000;
        outline: none;
    }
    #clip-zone:focus {
        border-color: #007dd4;
    }
    .btn-paste {
        margin-top: 10px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
        background: #007dd4;
        border: none;
        outline: none;
        cursor: pointer;
    }
</style>

<template>
    <main>
        <h1>剪贴板</h1>
        <div id="clip-zone" contenteditable="true"></div>
        <button @click="paste()" class="btn-paste" type="button">粘贴</button>
    </main>
</template>

<script>
    import $ from 'jquery';

    module.exports = {
        data() {
            return {
                //
            }
        },
        methods: {
            paste() {
                //
            }
        },
        mounted() {
            //
        }
    };
</script>
