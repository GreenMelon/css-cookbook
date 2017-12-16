/**
 * 按需引入lodash,避免体积过大
 * 用到的lodash的方法需要在这里显式说明
 */

import _ from 'lodash';

const Lodash = {
    debounce: _.debounce,
};

window._ = Lodash;

export default Lodash;
