/**
 * 添加后缀
 */

import Vue from 'vue';

const Subfix = Vue.filter('Subfix', (value = 0, subfix) => {
    return value + subfix;
});

export default Subfix;
