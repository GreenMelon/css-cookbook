<script>
import Vue from 'vue';
import Catalogue from '@/components/catalogue';

export default Vue.extend({
    mixins: [Catalogue],

    data() {
        return {
            dir: 'selector',
        };
    },
});
</script>
