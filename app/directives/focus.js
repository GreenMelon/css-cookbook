import Vue from 'vue';

const focus = Vue.directive('focus', {
    bind() {},
    inserted(el) {
        el.focus();
    },
    update() {},
    componentUpdated() {},
    unbind() {},
});

export default focus;
