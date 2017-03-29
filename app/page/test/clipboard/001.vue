<style lang="less" scoped>
    #clip-zone {
        margin-top: 30px;
        height: 300px;
        padding: 10px;
        border: 2px dashed #000;
        outline: none;
    }
    #clip-zone:focus {
        border-color: #007dd4;
    }
</style>

<template>
    <main>
        <h1>剪贴板</h1>
        <div id="clip-zone" contenteditable="true"></div>
    </main>
</template>

<script>
    import $ from 'jquery';
    const addImage = img => {
        const clipZone = document.getElementById('clip-zone');

        img.style.maxHeight = '100%';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.width = 'auto';

        clipZone.appendChild(img);
    };

    const createImage = imageData => {
        let img = new Image();
        img.onload = function() {
            addImage(img);
        };
        img.src = imageData;
        return img;
    };

    const paste = ev => {
        console.log('paste');
        ev.preventDefault();

        let items = ev.clipboardData.items;
        if(items) {
            [].slice.call(items).forEach(item => {
                if(item && item.type.indexOf('image') !== -1) {
                    let blob = item.getAsFile();
                    let reader = new FileReader();
                    reader.onload = ev => {
                        createImage(ev.target.result);
                    };
                    reader.readAsDataURL(blob);
                }
            });
        }
    };

    module.exports = {
        data() {
            return {
                //
            }
        },
        methods: {
            //
        },
        mounted() {
            document.addEventListener('paste', paste, false);
        },
        destoryed() {
            console.log('destoryed');
            document.removeEventListener('paste', paste, false);
        }
    };
</script>
