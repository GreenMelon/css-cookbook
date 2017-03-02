/**
 * 主入口, 主要是引入 vue-router 路由和 app.vue 入口组件
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './app.vue';
// import Env from './config/env';

import routes from './routes';

Vue.use(VueRouter);

// 开启 debug 模式
Vue.config.debug = true;

// 路由配置
// var router = new VueRouter({
    // 是否开启 History 模式的路由
    // 默认开发环境开启, 生产环境不开启
    // 如果生产环境的服务端没有进行相关配置, 请慎用

    // history: Env != 'production'
// });

// router.map({
//     '/index': {
//         name: 'index',
//         component: function (resolve) {
//             require(['./routers/index.vue'], resolve);
//         }
//     }
// });

// router.beforeEach(function () {
//     window.scrollTo(0, 0);
// });

// router.afterEach(function (transition) {
//     //
// });

// router.redirect({
//     '*': "/index"
// });

// App 提供了路由的挂载元素
// router.start(App, '#app');
//


// ROUTER 2.0
const router = new VueRouter({
    routes: routes
});

const app = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router
});

