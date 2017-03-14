<style lang="less" scoped>
</style>

<template>
    <main>
        <h1>网络图片</h1>
    </main>
</template>

<script>
    module.exports = {
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
