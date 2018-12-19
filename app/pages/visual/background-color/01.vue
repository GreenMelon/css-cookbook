<style lang="less" scoped>
    li {
        display: flex;
        margin-top: 10px;
        list-style: none;
        span {
            width: 80px;
            height: 60px;
        }
    }
</style>

<template>
    <main>
        <ul
            v-for="colors in colorList"
            :key="colors.name"
        >
            <li
                v-for="(group, idx) in colors.colors"
                :key="idx"
            >
                <span
                    v-for="(color, idx) in group"
                    :key="idx"
                    :style="{
                        'background-color': color,
                    }">
                </span>
            </li>
        </ul>
    </main>
</template>

<script>
    import Lodash from '@/utils/lodash';

    export default {
        data() {
            return {
                colorRules: [
                    {
                        name: '单色预设',
                        values: '000000 333333 666666 999999 cccccc ffffff b61d1c dd1010 f44336 ef9a9a ffcdd3 ffebee 880e4f c2185b e91f62 f48fb1 f8bbd0 fde4ec 4a148c 7b1fa2 9c26b0 ce93d8 e1bee7 f3e5f5 311b92 512da8 673ab7 b39ddb d0c4e9 ede7f6 1a237e 30409f 3e51b5 9fa8da c5cae9 e8eaf6 0d47a1 1976d2 2196f3 90caf9 bbdefb e3f2fd 016064 0097a7 03bcd4 81d4fa b2eaf2 e0f7fa 004d3f 00796b 009688 7fdeea b2dfdb e1f2f1 1b5e20 378e3c 4caf50 a5d6a7 c7e6c9 e9f4e9 33691e 699f38 8bc349 c5e1a5 ddedc8 f0f8e9 827718 afb42a cddc38 e6ee9c f0f4c3 f8fbe7 f57f16 fbbf2e feeb3c fff59d fff9c4 fffde7 ff6f00 fea001 ffc103 ffcc80 ffecb2 fff8e1 e65100 f57c00 ff9800 ffcc80 ffecb2 fff8e1 bf360d e64919 ff7752 ffab91 ffccbc fbe9e8 3e2723 5d4037 795548 bcaaa4 d7ccc9 efebe9 263238 455a64 607d8b 90a3ae cfd8dd edeff1',
                    }, {
                        name: '双色预设',
                        values: '000000 444444 000000 ffffff bfbfbf ffffff ff003c ff5c97 ff003c ffccc6 ff003c 1428c4 fb9817 ffcc80 fb9817 fff8e1 fb9817 4622dd ffe000 fbbf2e ffe000 fffde7 ffe000 000000 6dc414 f2f5b9 6dc414 dbffbd 6dc414 4922c4 00796b a5d6a7 00796b e1f2f1 00796b 032426 36c8f8 1976d2 36c8f8 e3f2fd 36c8f8 ffb6ce 3c5ef3 1b0268 3c5ef3 ffffff 3c5ef3 1f1347 8c20ba ff95ca 8c20ba d6bdff 8c20ba ffe000 152ea3 36c8f8 152ea3 e3f2fd 152ea3 ffdd7d f7e1ba c73229 f7e1ba ffd39f f7e1ba 000000 3e2723 795548 3e2723 efebe9 3e2723 ffc55d 4f5441 e2e8dd 813cf3 ff5c97 ff003c 000000 ffb3c5 ff7ea9 ffb3c5 ffe7c0 ffb3c5 cdaaf2',
                    }, {
                        name: '三色预设',
                        values: '000000 444444 bfbfbf 999999 bfbfbf e5e5e5 ff003c ff618e ffcad5 ff003c ffcad5 7041e5 ff003c f7e1ba ffb6ce ff003c ffffff 000000 fb9817 ffcc80 fff8e1 fb9817 813cf3 e9428b ffec00 fbbf2e ff618e ffec00 00796b 013329 ffec00 1428c4 813cf3 ffec00 7712c4 3e2723 6dc414 00796b 02473a 6dc414 e1f2f1 00796b 50d3ba 00497a e1f2f1 08c19d 152ea3 3e2723 00edff ffffff ff3395 00edff 1aadff 1428c4 94fcff ffb6ce ffea6c caed69 ffea6c ffb6ce d8b2f9 ffcad5 ffea6c 3c5ef3 94fcff 520bb7 3c5ef3 ffffff 1f1347 3c5ef3 ffffff 7712c4 e038c0 ff95ca ffcad5 ffb6ce 5c13e8 ffec00 7712c4 9a45ed c395f9 000000 7712c4 c395f9 7712c4 ffffff ff5c97 7712c4 ffec00 caed69 f7e1ba c73229 ffe000 f7e1ba 795548 3e2723 f7e1ba c395f9 7712c4 813cf3 ff5c97 ffd39f efdeb9 ffffff 000000 ffdee6 7712c4 c395f9 ffcad5 5c79f5 813cf3 f24327 ffec00 59e0b1',
                    }, {
                        name: '四色预设',
                        values: '000000 444444 bfbfbf ffffff 000000 d3dddc e1f2f1 ffffff ff003c ff618e f8bbd0 ffcad5 ff003c 002651 775ada 28c7fa ff5b45 ffba47 f5ff65 96cd39 ff3757 ff715a ffa974 ffde74 fe2f63 eaeaea 252a34 02d9d6 fa4659 feffe5 a3de83 2cb872 0e2431 fc3b52 f9b248 e7d5b7 000249 104392 ff5151 ff8b8b 3a0088 930077 e61c5d ffbd39 ff4d4d ff8364 fdb87d ffe8d5 3e3e3e f4722b f6e7c1 b3a78c 155263 ff6f3d ff9a3d ffc93c f6378f ffdd00 f5efe8 8fa5eb 2f3481 d6e6f2 f5f5f5 fff201 ffe037 1ecd9f 068c70 23033c 6901ff 9951ff ffd600 faf7ff 774998 e62976 fff201 ffffff 1a2f4b 29465c 2f8886 84c69b 7bc74d 222831 393e46 eeeeee 000000 198b9d b1d431 fff5f5 e4eddc 317673 154d53 1a3c40 fff395 7459dc 42b3ff 63f5ef cff802 feff92 0defbd 7899dc 5920ce 0c9cee 3dbcc2 a0f480 65ead1 e62976 fdb87d fcffc1 ffffff 01fff0 00d1ff 3d6cb9 062c80 0e6ac7 4eb9fc f6f5da 3e52e3 ffffff efe891 f12d2d 001f3f 0960bd 429ffd e1f2f1 0e1455 4d1184 932b77 fd367e fdefee fccde2 fc5c9c c5e3f6 ffdd00 f64e8b a01ba7 452a46 faee1e f3558f 9c1ce7 581b98 6901ff 9951ff ffd600 e1f2f1 fffbe3 ffa9a9 6a425c 26271a 432a9d f14e95 b13cd5 fbf3fc bad7df ffe2e3 f6f6f6 99ddcd fb929e ffdfdf fff6f6 afdefc fdfcc4 ffe8cf ffdede ccffec f9f3e6 e2dcd5 e8aa8c 5f616a 343434 8d8b82 eadcbe f3f3f3 e3d9ca 95a792 596c68 403f48 073358 104471 fc3c3c f6f6f6',
                    }, {
                        name: '五色预设',
                        values: '000000 444444 999999 bfbfbf ffffff dd1010 f44336 ef9a9a ffcdd3 ffebee c2185b e91f62 f48fb1 f8bbd0 fde4ec 7b1fa2 9c26b0 ce93d8 e1bee7 f3e5f5 512da8 673ab7 b39ddb d0c4e9 ede7f6 30409f 3e51b5 9fa8da c5cae9 e8eaf6 1976d2 2196f3 90caf9 bbdefb e3f2fd 00796b 009688 7fdeea b2eaf2 e0f7fa 378e3c 4caf50 a5d6a7 c7e6c9 e9f4e9 fbbf2e feeb3c fff59d fff9c4 fffde7 f57c00 ff9800 ffcc80 ffecb2 fff8e1 e64919 ff7752 ffab91 ffccbc fbe9e8 5d4037 795548 bcaaa4 d7ccc9 efebe9 ff5b45 ffba47 f5ff65 96cd39 bbdefb ffffa6 bdf271 28d9c2 00a2a6 2f2933 f4661c fde408 fdf6de a3d0c1 0c2550 d0e64a 99c836 32a6b2 186674 093a4a ffed02 ff9b0c ff4057 c70251 935da3 e2e1e9 ccc9d1 a4abbf 606273 f00706 8fced6 6aadc9 2e5f73 f25260 c3ae8d f23c3c f0dfd0 c7c5a7 8ba88f 239396 f2e105 fffffd 91d9d9 4ea6a6 347373 c84124 5e7d4d e0d1a3 7d603e 232621 d4a960 ab6936 8c3b3c 3f3d3a 637d74',
                    },
                ],
            }
        },
        computed: {
            colorList() {
                const { colorRules } = this;

                return colorRules.map(rule => {
                    const colors = Lodash.chunk(rule.values.split(' ').map(i => `#${i}`).slice(6), 6);
                    console.log(colors);
                    return Object.assign(rule, {
                        colors,
                    });
                })
            },
        },
    }
</script>
