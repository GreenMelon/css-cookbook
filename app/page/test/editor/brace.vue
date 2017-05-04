<style lang="less" scoped>
    #brace {
        height: 300px;
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <button @click="insert" type="button">insert</button>
        <button @click="validate" type="button">validate</button>
        <div id="brace"></div>
        <p v-text="isValid"></p>
    </main>
</template>

<script>
    import brace from 'brace';
    import 'brace/mode/javascript';
    import 'brace/theme/monokai';

    export default {
        data() {
            return {
                editor: null,

                code: {
                    name: 'caigua',
                    age: 24,
                    favor: ['nba', 'writting']
                },

                isValid: false
            }
        },
        methods: {
            insert() {
                let value = JSON.stringify(this.code);
                this.editor.setValue(JSON.stringify(JSON.parse(value), null, '\t'));

                // this.editor.setValue(JSON.stringify(this.code), null, '\t');
            },
            validate() {
                // const isJSON = json => {
                //     var isJson = typeof json == 'object' && Object.prototype.toString.call(json).toLowerCase() == '[object object]' && !json.length;
                //     return isJson;
                // };

                const isJSON = json => {
                    try {
                        JSON.parse(json);
                        return true;
                    } catch(e) {
                        console.log(e);
                        return false;
                    }
                }

                let code = this.editor.getValue();
                this.isValid = isJSON(code);
            }
        },
        mounted() {
            let editor = this.editor = ace.edit('brace');
            editor.getSession().setMode('ace/mode/javascript');
            editor.setTheme('ace/theme/monokai');
        }
    };
</script>
