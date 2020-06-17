<style lang="less" scoped>
    video {
        width: 500px;
    }
</style>

<template>
    <main>
        <h1>MSE</h1>

        <video :src="src" id="video"></video>

    </main>
</template>

<script>
// Media Source Extensions
export default {
    data() {
        return {
            src: 'http://www.caiguazai.com/796795205.mp4',
            video: null
        }
    },
    methods: {
        init() {
            this.video = window.video;

            const videoElement = document.querySelector('video');

            if (window.MediaSource) {
                const mediaSource = new MediaSource();
                videoElement.src = URL.createObjectURL(mediaSource);
                mediaSource.addEventListener('sourceopen', sourceOpen);
            } else {
                console.log("The Media Source Extensions API is not supported.")
            }

            function sourceOpen(e) {
                URL.revokeObjectURL(videoElement.src);

                const mime = 'video/webm; codecs="opus, vp9"';
                const mediaSource = e.target;
                const sourceBuffer = mediaSource.addSourceBuffer(mime);
                const videoUrl = 'droid.webm';

                fetch(videoUrl)
                    .then(response => {
                        return response.arrayBuffer();
                    })
                    .then(arrayBuffer => {
                        sourceBuffer.addEventListener('updateend', e => {
                            if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
                                mediaSource.endOfStream();
                            }
                        });

                        sourceBuffer.appendBuffer(arrayBuffer);
                    });
            }
        }
    },
    mounted() {
        this.init();
    }
};
</script>
