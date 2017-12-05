<style lang="less" scoped>
</style>

<template>
    <main>
        <h1>网络图片</h1>
        <li>
            <a href="http://javascript.ruanyifeng.com/htmlapi/file.html#toc2">文件和二进制数据的操作</a>
        </li>
        <li>
            <a href="http://www.qttc.net/201304304.html">JS快速获取图片宽高的方法</a>
        </li>
        <li>
            <a href="http://stackoverflow.com/questions/8390855/how-to-instantiate-a-file-object-in-javascript">how-to-instantiate-a-file-object-in-javascript</a>
        </li>
        <li>
            <a href="http://www.alloyteam.com/2014/01/use-js-file-download/">在浏览器端用JS创建和下载文件</a>
        </li>
        <li>
            <a href="https://www.ibm.com/developerworks/cn/web/1101_hanbf_fileupload/">使用 JavaScript File API 实现文件上传</a>
        </li>
        <li>
            <a href="https://www.html5rocks.com/zh/tutorials/file/xhr2/">XMLHttpRequest2 新技巧</a>
        </li>
        <li>
            <a href="https://www.html5rocks.com/zh/tutorials/file/dndfiles/">通过 File API 使用 JavaScript 读取文件</a>
        </li>
        <li>
            <a href="http://www.w3school.com.cn/jsref/dom_obj_fileupload.asp">HTML DOM FileUpload 对象</a>
        </li>
        <li>
            <a href="http://www.haorooms.com/post/js_inputfileupload">input file 文件上传,js控制上传文件的大小和格式</a>
        </li>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                url: 'http://ss.bdimg.com/static/superman/img/logo/bd_logo1_31bdc765.png'
            }
        },
        methods: {
            // load() {
            //     let img = new Image();
            //     img.onload = () => {
            //         let reader = new FileReader();
            //         reader.onload = () => {
            //
            //         };
            //         reader.readAsDataURL(img);
            //     };
            //     img.src = this.url;
            // },
            load() {
                //
            }
        },
        created() {
            this.load();
        }
    };
</script>
