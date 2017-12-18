import Vue from 'vue';

const focus = Vue.directive('focus', {
    params: ['a'],
    bind() {},
    inserted(el, binding) {
        // console.log(binding.def.params, binding.value.a);
        el.focus();
    },
    update() {},
    componentUpdated() {},
    unbind() {},
});

export default focus;
