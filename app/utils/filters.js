import Vue from 'vue';

const Subfix = Vue.filter('Subfix', (value = 0, subfix) => {
    return value + subfix;
});

const filters = {
    Subfix
};

export default filters;
