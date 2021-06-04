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
                :categories="category.childrens"
            />

            <router-link
                v-if="!isParent(category)"
                :to="getRoutePath(category)"
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
            /* eslint-disable */
            default: [],
        },
    },

    methods: {
        isParent(c) {
            return c.childrens.length > 0;
        },

        getBaseRoute(c) {
            if (c.name) {
                return `${this.baseRoute}/${c.name}`;
            }
            return this.baseRoute;
        },

        getRoutePath(c) {
            return `${this.baseRoute}/${c.name}`;
        },

        getRouteName(c) {
            return c.alias || c.name;
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
