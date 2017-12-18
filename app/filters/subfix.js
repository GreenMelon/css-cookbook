/**
 * 添加后缀
 */

import Vue from 'vue';

const subfix = Vue.filter('Subfix', (value = 0, subfix) => {
    return value + subfix;
});

export default subfix;
