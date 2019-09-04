<style lang="less" scoped>
h1 {
    font-size: 30px;
    text-transform: uppercase;
    text-align: center;
    color: #607af4;
}
.container {
    display: grid;
	height: 100%;
	grid-template-rows: auto 1fr auto;
	grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	text-align: center;
}
.outline-box {
    width: 180px;
	height: 180px;
	margin: 50px auto;
}
code {
    padding: 4px 6px;
	border-radius: 4px;
	background-color: #dedede;
}
</style>

<template>
    <main>
        <h1>outset-style</h1>
        <div class="container">
            <div
                v-for="(option, index) in options"
                :key="index"
                class="card"
            >
                <div
                    :style="{
                        backgroundColor: option.backgroundColor,
                        outline: `${option.width} ${option.type} ${option.color}`,
                        outlineOffset: `${option.offset}`,
                    }"
                    class="outline-box"
                />
                <code>{{ option.type }}</code>
            </div>
        </div>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                options: [
                    {
                        name: '',
                        type: 'double',
                        backgroundColor: '#976bee',
                        width: '14px',
                        color: 'white',
                        offset: '-20px',
                    }, {
                        name: '',
                        type: 'dotted',
                        backgroundColor: '#e65353',
                        width: '24px',
                        color: 'white',
                        offset: '-12px',
                    }, {
                        name: '',
                        type: 'dotted',
                        backgroundColor: '#ffd835',
                        width: '40px',
                        color: 'white',
                        offset: '-20px',
                    }, {
                        name: '',
                        type: 'dashed',
                        backgroundColor: '#70bc59',
                        width: '22px',
                        color: 'white',
                        offset: '-12px',
                    }, {
                        name: '',
                        type: 'groove',
                        backgroundColor: 'antiquewhite',
                        width: '14px',
                        color: 'burlywood',
                        offset: '-14px',
                    }, {
                        name: '',
                        type: 'ridge',
                        backgroundColor: 'azure',
                        width: '14px',
                        color: 'lightblue',
                        offset: '-14px',
                    }, {
                        name: '',
                        type: 'outset',
                        backgroundColor: 'floralwhite',
                        width: '24px',
                        color: 'pink',
                        offset: '-24px',
                    }, {
                        name: '',
                        type: 'inset',
                        backgroundColor: 'bisque',
                        width: '24px',
                        color: 'sandybrown',
                        offset: '-24px',
                    }, {
                        name: '',
                        type: 'auto',
                        backgroundColor: 'aliceblue',
                        width: '50px',
                        color: 'lavender',
                    }
                ],
            }
        },
    }
</script>
