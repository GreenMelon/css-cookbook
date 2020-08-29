<style lang="less" scoped>
@font-size: 16px;

form {
    margin: 0 auto;
}
.upload-file-beautify {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    overflow: hidden;
    width: 10 * @font-size;
    height: 3 * @font-size;
    line-height: 2 * @font-size;
    padding: .5 * @font-size 1 * @font-size;
    font-family: 'MicroSoft YaHei';
    font-size: @font-size;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-radius: .3 * @font-size;
    color: #fff;
    background-color: #c7254e;
    cursor: pointer;
}
.upload-file {
    position: absolute;
    right: 999 * @font-size;
    clip: rect(0,0,0,0);
    opacity: 0;
}
</style>

<template>
    <main>
        <form enctype="multipart/form-data">
            <label
                class="upload-file-beautify"
                for="upload-file"
            >
                <span>自定义上传按钮</span>
                <input
                    type="file"
                    id="upload-file"
                    name="upload-file"
                    class="upload-file"
                />
            </label>
        </form>
    </main>
</template>

<script>
export default {}
</script>
