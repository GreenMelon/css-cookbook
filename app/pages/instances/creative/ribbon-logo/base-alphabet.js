import RibbonAlphabet from './ribbon-alphabet';
import RibbonSharp from './ribbon-sharp';
import RibbonSquare from './ribbon-square';

const baseAlphabet = {
    components: {
        RibbonAlphabet,
        RibbonSharp,
        RibbonSquare,
    },

    props: {
        size: {
            type: Number,
            default: 12,
        },
        widthTimes: {
            type: Number,
            default: 1,
        },
        heightTimes: {
            type: Number,
            default: 1,
        },
    },

    computed: {
        halfWidth() {
            return (1 + this.widthTimes + 1) * this.size / 2;
        },
        halfHeight() {
            return (1 + this.heightTimes + 1) * this.size / 2;
        },
        halfSize() {
            return this.size / 2;
        },
    },
};

export default baseAlphabet;
