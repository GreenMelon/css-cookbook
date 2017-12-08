import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import routes from './config/routes';

Vue.use(VueRouter);
Vue.config.debug = true;

const router = new VueRouter({
    routes: routes
});

const app = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router
});
