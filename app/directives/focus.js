import Vue from 'vue';

const focus = Vue.directive('focus', {
    params: ['a'],
    bind() {},
    inserted(el) {
        el.focus();
    },
    update() {},
    componentUpdated() {},
    unbind() {},
});

export default focus;
