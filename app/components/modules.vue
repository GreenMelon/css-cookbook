<template>
    <aside>
        <ul class="mod-modules list-module">
            <li
                v-for="(module, index) in modules"
                :key="index"
                class="item"
            >
                <router-link
                    :to="module.route"
                    :class="{active: $route.path.startsWith(module.route)}">{{ module.name }}
                </router-link>
            </li>
        </ul>
    </aside>
</template>

<script>
    import Vue from 'vue';

    const Modules = Vue.extend({
        props: {
            modules: {
                type: Array,
                default: [],
            },
        },
        data() {
            return {}
        },
        methods: {},
        mounted() {},
    });

    Vue.component('modules', Modules);

    export default Modules;

</script>

<style lang="less" scoped>
li {
    list-style: none;
}

</style>
