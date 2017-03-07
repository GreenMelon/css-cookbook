<style lang="less" scoped>
    #brace {
        height: 300px;
    }
</style>

<template>
    <main>
        <nav>xxxx</nav>
        <button @click="submit" type="button">click me</button>
        <div id="brace"></div>
    </main>
</template>

<script>
    import brace from 'brace';
    import 'brace/mode/javascript';
    import 'brace/theme/monokai';

    module.exports = {
        data() {
            return {
                code: {
                    name: 'caigua',
                    age: 24,
                    favor: ['nba', 'writting']
                },
                editor: null
            }
        },
        methods: {
            submit() {
                let value = JSON.stringify(this.code);
                this.editor.setValue(JSON.stringify(JSON.parse(value), null, '\t'));

                // this.editor.setValue(JSON.stringify(this.code), null, '\t');
            }
        },
        mounted() {
            let editor = this.editor = ace.edit('brace');
            editor.getSession().setMode('ace/mode/javascript');
            editor.setTheme('ace/theme/monokai');
        }
    };
</script>
