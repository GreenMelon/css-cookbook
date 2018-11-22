<style lang="less" scoped>
    // option:default {
    //     font-size: 16px;
    //     background-color: red;
    // }

    input:default + label::after {
        content: " (盛世美颜) \1F44D";
    }
    input:checked:not(:default) + label::after {
        content: " ❤️";
    }

    p {
        font-size: 20px;
        line-height: 36px;
    }
</style>

<template>
    <main>
        <form>
            <!-- <select multiple>
                <option value="1">1</option>
                <option value="2" selected>2</option>
                <option value="3">3</option>
            </select> -->
            <h1>魔镜魔镜告诉我，谁是前端组里最美的人</h1>
            <div>
                <p>
                    <input type="radio" name="option" id="radio1">
                    <label for="radio1">灿灿</label>
                </p>
                <p>
                    <input type="radio" name="option" id="radio2">
                    <label for="radio2">芝士</label>
                </p>
                <p>
                    <input type="radio" name="option" id="radio3">
                    <label for="radio3">瓶子</label>
                </p>
                <p>
                    <input type="radio" name="option" id="radio4">
                    <label for="radio4">风铃</label>
                </p>
                <p>
                    <input type="radio" name="option" id="radio5" checked>
                    <label for="radio5">小米</label>
                </p>
            </div>
        </form>
    </main>
</template>

<script>
    export default {};
</script>
