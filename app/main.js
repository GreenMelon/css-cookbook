import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
// import routes from './config/routes'; // 手动注入路由
import routes from './config/routes.util'; // 自动生成路由
import filters from './filters/index';
import directives from './directives/index';

Vue.use(VueRouter);
Vue.config.debug = true;

const router = new VueRouter({
    routes,
});

const app = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,
    filters,
    directives,
});
