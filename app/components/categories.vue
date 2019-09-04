<template>
    <ul class="mod-categories">
        <li
            v-for="(category, index) in categories"
            :key="index"
        >
            <h1
                v-if="isParent(category)"
                v-text="category.alias || category.name"
            />

            <categories
                v-if="isParent(category)"
                :base-route="getBaseRoute(category)"
                :categories="category.children"
            />

            <router-link
                v-if="!isParent(category)"
                :to="getRoute(category)"
                v-text="getRouteName(category)"
            />
        </li>
    </ul>
</template>

<script>
import Vue from 'vue';

const categories = Vue.extend({
    props: {
        baseRoute: {
            type: String,
            default: '',
        },

        categories: {
            type: Array,
            default: [],
        },
    },

    methods: {
        isParent(c) {
            return c.children;
        },

        getBaseRoute(c) {
            if (c.name) {
                return `${this.baseRoute}/${c.name}`;
            }
            return this.baseRoute;
        },

        getRoute(c) {
            return `${this.baseRoute}/${c.route}`;
        },

        getRouteName(c) {
            return c.alias || c.route;
        },
    },
});

Vue.component('categories', categories);

export default categories;
</script>

<style lang="less">
.mod-categories {
    margin-left: 50px;
}
</style>
