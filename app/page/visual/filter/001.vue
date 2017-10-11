<style lang="less" scoped>
    .filter-list {
        display: flex;
        flex-wrap: wrap;
        .filter-item {
            margin: 0 10px 10px 0;
        }
        img {
            width: 200px;
            cursor: pointer;
            &:hover {
                transition: filter .5s;
                filter: none !important;
            }
        }
        p {
            text-align: center;
            letter-spacing: 0.1em;
        }

        .grayscale {
            filter: grayscale(1);
        }
        .sepia {
            filter: sepia(1);
        }
        .hue-rotate {
            filter: hue-rotate(45deg);
        }
        .saturate {
            filter: saturate(6);
        }
        .brightness {
            filter: brightness(.5);
        }
        .invert {
            filter: invert(.8);
        }
        .opacity {
            filter: opacity(.5);
        }
        .contrast {
            filter: contrast(200%);
        }
        .blur {
            filter: blur(10px);
        }
        .drop-shadow {
            filter: drop-shadow(10px 10px 5px blue);
        }
    }
</style>

<template>
    <main>
        <ul class="filter-list">
            <li v-for="filter in filters" class="filter-item">
                <img :class="filter.value" src="../../../images/blue-sky.jpg" alt="sky">
                <p>{{ filter.value + ' ' + filter.name }}</p>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                filters: [
                    {
                        name: '原图',
                        value: 'normal'
                    },{
                        name: '灰度',
                        value: 'grayscale'
                    },{
                        name: '褐色',
                        value: 'sepia'
                    },{
                        name: '色相旋转',
                        value: 'hue-rotate'
                    },{
                        name: '饱和度',
                        value: 'saturate'
                    },{
                        name: '亮度',
                        value: 'brightness'
                    },{
                        name: '反色',
                        value: 'invert'
                    },{
                        name: '透明度',
                        value: 'opacity'
                    },{
                        name: '对比度',
                        value: 'contrast'
                    },{
                        name: '模糊',
                        value: 'blur'
                    },{
                        name: '阴影',
                        value: 'drop-shadow'
                    }
                ]
            }
        }
    };
</script>
