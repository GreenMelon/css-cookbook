<style lang="less" scoped>
    // 方式二
    input:-webkit-autofill {
        &,
        &:hover,
        &:focus {
            box-shadow: 0 0 0 50px white inset;
            -webkit-text-fill-color: #333;
        }
    }
    // 方式三
    input:-webkit-autofill {
        transition: background 9999s ease;
    }
</style>

<template>
    <main>
        <form @submit.prevent="save">
            <input type="text" name="nick"><br>
            <button type="submit">submit</button>
        </form>

        <!-- 方式一 -->
        <form autocomplete="off" @submit.prevent="save">
            <input type="text" name="nick"><br>
            <button type="submit">submit</button>
        </form>

        <ul>
            <li
                v-for="(item, inx) in articles"
                :key="inx"
            >
                <a :href="item" target="_blank">参考文章 {{ inx+1 }}</a>
            </li>
        </ul>
    </main>
</template>

<script>
export default {
    data() {
        return {
            articles: [
                'https://blog.niceue.com/front-end-development/Remove-forced-yellow-input-background-in-Chrome.html',
                'http://stackoverflow.com/questions/2338102/override-browser-form-filling-and-input-highlighting-with-html-css',
                'http://labs.enonic.com/articles/remove-forced-yellow-input-background-in-chrome'
            ]
        }
    },
    methods: {
        save() {}
    }
};
</script>
