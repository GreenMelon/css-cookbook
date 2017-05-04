<style lang="less" scoped>
    #input {
        width: 100%;
        height: 30px;
    }
    #textarea {
        margin-top: 20px;
        width: 100%;
        min-height: 100px;
    }
    #clip-zone {
        margin-top: 30px;
        height: 300px;
        padding: 10px;
        font-size: 14px;
        border: 2px dashed #000;
        outline: none;
    }
    #clip-zone:empty::before {
        content: "右键粘贴图片 (Ctrl + V)";
        color: #999;
    }
    #clip-zone:not(:empty)::before {
        content: "";
    }
    #clip-zone:focus {
        border-color: #007dd4;
    }
</style>

<template>
    <main>
        <h1>剪贴板</h1>

        <input @focus="selectAll($event)" id="input" type="text">

        <textarea id="textarea" name="textarea" cols="30" rows="10"></textarea>

        <!-- 自定义文本域 -->
        <div
            @focus="select($event)"
            id="clip-zone"
            contenteditable="true">
        </div>
    </main>
</template>

<script>
    import $ from 'jquery';

    const addImage = img => {
        const clipZone = document.getElementById('clip-zone');
        clipZone.innerHTML = '';

        img.style.maxHeight = '100%';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.width = 'auto';

        // clipZone.appendChild(img);
        clipZone.insertBefore(img, clipZone.firstChild);
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
        ev.stopPropagation();

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

    export default {
        data() {
            return {
                //
            }
        },
        methods: {
            selectAll(ev) {
                const elem = ev.target;
                const len = elem.value.length;
                let range;
                if (elem.createTextRange) {
                    range = elem.createTextRange();
                    range.select();
                }
                else if (elem.setSelectionRange) {
                    elem.setSelectionRange(0, len);  // 全选
                }
            },
            select(ev) {
                const elem = ev.target;
            }
        },
        mounted() {
            const clipZone = document.getElementById('clip-zone');
            clipZone.addEventListener('paste', paste, false);

            document.addEventListener('paste', () => {
                alert('捕获');
            }, false);
        },
        destoryed() {
            console.log('destoryed');
            const clipZone = document.getElementById('#clip-zone');
            clipZone.removeEventListener('paste', paste, false);
        }
    };
</script>
