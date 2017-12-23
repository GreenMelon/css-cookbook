<template>
    <aside>
        <ul class="mod-modules list-module">
            <li v-for="module in modules" class="item">
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
