import RibbonAlphabet from './ignore-ribbon-alphabet';
import RibbonSharp from './ignore-ribbon-sharp';
import RibbonSquare from './ignore-ribbon-square';

const baseAlphabet = {
    components: {
        RibbonAlphabet,
        RibbonSharp,
        RibbonSquare,
    },

    data() {
        return {
            size: 12,
            widthTimes: 4,
            heightTimes: 8,
        };
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
