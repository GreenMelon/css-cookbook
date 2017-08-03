<style lang="less" scoped>
    input {
        padding: 10px;
        outline: none;
    }
    .not-spellcheck {
        &::-moz-selection {
            // color: #fff;
            // background-color: #007dd4;
        }
        &::selection {
            // color: #fff;
            // background-color: #00f;
        }
    }
</style>

<template>
    <main>
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck">spellcheck</a>
        <table>
            <tr>
                <td>
                    <p>
                        <input
                            v-model="a"
                            @focus="select($event)"
                            type="text"
                            spellcheck="true"
                        >
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        <input
                            v-model="b"
                            @focus="select($event)"
                            class="not-spellcheck"
                            type="text"
                            spellcheck="false"
                        >
                    </p>
                </td>
            </tr>
        </table>
    </main>
</template>

<script>
    import $ from 'jquery';
    export default {
        data() {
            return {
                a: 'xxxxx',
                b: 'yyyyy'
            }
        },
        methods: {
            select(e) {
                $(e.target).select();
            }
        }
    };
</script>
