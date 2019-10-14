<style lang="less" scoped>
main {
    height: 100vh;
}

.prev,
.next {
    position: absolute;
	top: 50%;
	margin-top: -20px;
    width: 40px;
    height: 40px;
    text-indent: -10000px;
	opacity: 0.6;
	cursor:pointer;
    transition: opacity 200ms ease-out;
    &:hover {
	    opacity: 1;        
    }
}
.prev {
	left: 0;
	background: #000 url('https://lh4.googleusercontent.com/-JN1IZLtuToI/UUoZnMG3C_I/AAAAAAAAAE8/SEbJ9nqXGnY/s226/sprite.png') no-repeat -200px 0px;
}
.next {
	right: 0;
	background: #000 url('https://lh4.googleusercontent.com/-JN1IZLtuToI/UUoZnMG3C_I/AAAAAAAAAE8/SEbJ9nqXGnY/s226/sprite.png') no-repeat -167px 0px;
}

.slider {
	position: relative;
	height: 100%;
}
.slide {
	position: absolute;
	height: 100%;
	width: 100%;
}
.slide:target {
	z-index: 100;
}
img {
    max-width: 100%;
    height: auto;
}
</style>

<template>
    <main>
        <div class="slider">
            <ul>
                <li
                    v-for="(image, index) in images"
                    :key="index"
                    :id="getSlider(index, 0, images.length)"
                    class="slide"
                >
                    <img
                        :src="image"
                        alt="preview"
                    >
                    <a
                        class="prev"
                        :href="`#${getSlider(index, -1, images.length)}`"
                    >
                        prev
                    </a>
                    <a
                        class="next"
                        :href="`#${getSlider(index, 1, images.length)}`"
                    >
                        next
                    </a>
                </li>
            </ul>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            images: [
                'https://lh3.googleusercontent.com/-PcDDGh9C6Uk/UUoRYu8TmGI/AAAAAAAAADk/bVCVnUEott4/s1231/2.jpeg.jpg',
                'https://lh5.googleusercontent.com/-ImESS5vXwTQ/UUoRZtDDdwI/AAAAAAAAAD0/mBlvPxXMuDU/s1231/3.jpeg.jpg',
                'https://lh3.googleusercontent.com/-a4HykmTjnLw/UUoRZ9AOzNI/AAAAAAAAAD8/bsVqg8naI2o/s1231/4.jpeg.jpg',
                'https://lh5.googleusercontent.com/-lmIWz4ADxc0/UUoRaFjdNXI/AAAAAAAAAEI/widPZMMiBVM/s1231/5.jpeg.jpg',
            ],
        };
    },

    methods: {
        getSlider(value, step, total) {
            const index = (value + step + total) % total;
            return `no-js-slider-${index}`;
        },
    },
}
</script>
