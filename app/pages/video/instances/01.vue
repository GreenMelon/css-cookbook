<style lang="less" scoped>
    video {
        width: 500px;
    }
    ul {
        &::after {
            content: "";
            display: table;
            clear: both;
        }
        li {
            float: left;
            margin: 0 10px;
            padding: 10px;
            border-radius: 4px;
            color: #fff;
            background-color: #007dd4;
            user-select: none;
            cursor: pointer;
            &:active {
                background-color: #05558c;
            }
        }
    }
</style>

<template>
    <main>
        <h1>VIDEO</h1>

        <!-- width 宽度 -->
        <!-- height 高度 -->

        <!-- preload 预加载 -->
        <!-- src 视频地址 -->

        <!-- controls 控件 -->
        <!-- autoplay 自动播放 -->
        <!-- loop 循环 -->
        <!-- muted 静音 -->

        <video
            :src="src"
            id="video"
            controls
            loop
            muted>
        </video>

        <ul>
            <li @click="toggleControls">切换控件</li>
            <li @click="play">播放</li>
            <li @click="pause">暂停</li>
        </ul>

        <p>
            <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video"></a>
        </p>
        <p>
            <a href="https://developer.mozilla.org/zh-CN/docs/Web/Guide/Events/Media_events"></a>
        </p>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                src: 'http://www.caiguazai.com/796795205.mp4',
                video: {}
            }
        },
        methods: {
            init() {
                this.video = window.video;
                console.log('video', video);
            },
            toggleControls() {
                this.video.controls = !this.video.controls;
            },
            play() {
                this.video.play();
            },
            pause() {
                this.video.pause();
            }
        },
        mounted() {
            this.init();
        }
    };
</script>
