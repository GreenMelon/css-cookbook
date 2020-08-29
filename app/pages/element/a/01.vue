<style lang="less">
</style>

<template>
    <main id="main">
        <input
            v-model="isLogin"
            value="1"
            type="radio"
        >
        <br>

        <a
            @click="beforeSkip($event, 1)"
            href="//baidu.com"
            target="_blank">a 标签跳转
        </a>
        <br>

        <a
            @click="beforeSkip($event, 0)"
            href="javascript:void(0);"
            target="_blank">js 跳转
        </a>
    </main>
</template>

<script>
export default {
    data() {
        return {
            isLogin: 0,
        }
    },
    methods: {
        beforeSkip(evt, hasHref) {
            if (hasHref) {
                console.log('yes');
            } else {
                console.log('no');
                evt.preventDefault();

                if (+this.isLogin) {
                    // 方法1: window.open
                    // window.open('//baidu.com');

                    // 方法2: 创建 a 标签
                    // const a = document.createElement('a');
                    // a.href = '//baidu.com';
                    // a.target = '_blank';
                    // document.body.append(a);
                    // a.click();

                    // 如果有超过一秒的延时 (Chrome 提示：已拦截弹出式窗口)
                    setTimeout(function() {
                        window.open('//baidu.com');
                    }, 1001);
                } else {
                    alert('未登录');
                }
            }
        },
    }
}
</script>
