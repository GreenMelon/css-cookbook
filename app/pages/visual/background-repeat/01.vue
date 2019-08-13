<style lang="less" scoped>
.image {
    overflow: hidden;
    resize: horizontal;
}
</style>

<template>
    <main>
        <div
            v-for="(option, index) in options"
            :key="index"
        >
            <h2>{{ `background-repeat: ${option};` }}</h2>
            <div
                class="image"
                :style="{
                    width: '550px',
                    height: '200px',
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: option,
                }"
            ></div>
        </div>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                options: [
                    'repeat',
                    'round',
                    'space'
                ],
                url: 'https://st-gdx.dancf.com/gaodingx/341/design/20190731-152542-1dab.png',
            };
        },
    }
</script>
