<style scoped lang="less">
    #wrap {
        position: relative;
        height: 100px;
        width: 100px;
        overflow-x: hidden;
        background: #000;
        p {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            transition: left .1s;
            margin: 0;
            white-space: nowrap;
            color: #fff;
        }
    }
</style>

<template>
    <main>
        <div id="wrap">
            <p
                :style="{
                    left: left + 'px',
                }"
                v-text="content"
            ></p>
        </div>
        <button
            @click="start"
            type="button">click
        </button>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                left: 0,
                content: '',
            };
        },
        methods: {
            start() {
                const self = this;
                const wrap = document.getElementById('wrap');
                this.left = wrap.offsetWidth;
                this.content = '活动开始了';

                setInterval(function() {
                    // console.log(self.left);
                    self.left--;
                }, 100);
            },
        },
    };
</script>
