<template>
    <ul class="list-category mod-categories">
        <li
            v-for="category in categories"
            :key="category.name"
            class="item-main"
        >
            <h2 v-text="category.name"></h2>
            <ul class="list-instance">
                <li
                    v-for="instance in category.instances"
                    :key="instance.name"
                    class="item-sub"
                >
                    <router-link
                        :to="instance.route"
                        v-text="instance.name">
                    </router-link>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
    import Vue from 'vue';

    const Categories = Vue.extend({
        props: {
            categories: {
                type: Array,
                default: [],
            }
        },
        data() {
            return {}
        },
        methods: {},
        mounted() {},
    });

    Vue.component('categories', Categories);

    export default Categories;

</script>

<style lang="less">
.list-category,
.list-category li,
.list-instance,
.list-instance li {
    font-size: 20px;
    list-style: none;
}
</style>
