<style scoped>
    .main-list {
        margin: 0 auto;
        width: 300px;
        font-size: 14px;
    }
    h1 {
        height: 32px;
        line-height: 32px;
        font-size: inherit;
        background-color: #ccc;
        cursor: pointer;
    }
    .sub-list {
        padding-left: 20px;
        background-color: #ddd;
        height: 84px;
        overflow: hidden;
        transition: height .5s ease-in-out;
    }
</style>

<template>
    <main>
        <ul class="main-list">
            <li
                v-for="(mainMenu, mainIndex) in mainMenus"
                :key="mainIndex"
                class="main-item"
            >
                <h1 class="main-item-name">{{ mainMenu.name }}</h1>
                <ul class="sub-list" style="height: 0px">
                    <li
                        v-for="(subMenu, subIndex) in mainMenu.subMenus"
                        :key="subIndex"
                        class="sub-item">{{ subMenu.name }}
                    </li>
                </ul>
            </li>
        </ul>
    </main>
</template>

<script>
    import $ from 'jquery';

    export default {
        data() {
            return {
                mainMenus: [
                    {
                        name: '导航1',
                        subMenus: [
                            { name: '导航1-1' },
                            { name: '导航1-2' },
                            { name: '导航1-3' },
                            { name: '导航1-4' },
                            { name: '导航1-5' },
                            { name: '导航1-6' },
                        ]
                    },{
                        name: '导航2',
                        subMenus: [
                            { name: '导航2-1' },
                            { name: '导航2-2' },
                            { name: '导航2-3' },
                            { name: '导航2-4' },
                            { name: '导航2-5' },
                            { name: '导航2-6' },
                        ]
                    },{
                        name: '导航3',
                        subMenus: [
                            { name: '导航3-1' },
                            { name: '导航3-2' },
                            { name: '导航3-3' },
                            { name: '导航3-4' },
                            { name: '导航3-5' },
                            { name: '导航3-6' },
                        ]
                    }
                ]
            }
        },
        methods: {
            init() {
                $('.main-item-name').on('click', function() {
                    let mainItem = $(this).parent();
                    let height = mainItem.find('.sub-list').height();
                    if (height) {
                        mainItem.find('.sub-list').height(0);
                    }
                    else {
                        mainItem.find('.sub-list').height(84);
                        mainItem.siblings().find('.sub-list').height(0);
                    }
                });
            }
        },
        mounted() {
            this.init();
        }
    }
</script>
