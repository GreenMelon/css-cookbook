import Vue from 'vue';
import Catalogue from './main';

export default function create(dir) {
    return Vue.extend({
        mixins: [Catalogue],
    
        data() {
            return {
                dir,
            };
        },
    });
}
