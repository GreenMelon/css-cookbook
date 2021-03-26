<style lang="less" scoped>
.rating {
    display: inline-flex;
    flex-direction: row-reverse;
    font-size: 1rem;
}

.rating__input--hidden {
    position: absolute;
    margin: -1px;
    width: 1px;
    height: 1px;
    padding: 0;
    border: 0;
    overflow: hidden;

    clip: rect(1px 1px 1px 1px);
    clip: rect(1px, 1px, 1px, 1px);
}

.rating__label {
    color: lightgray;
    cursor: pointer;
}

.rating__icon::before {
    content: "★";
}

.rating__input:hover ~ .rating__label {
    color: gray;
}

.rating__input:checked ~ .rating__label {
    color: goldenrod;
}

</style>

<template>
    <main>
        <div class="rating">
            <template v-for="star in stars">
                <input
                    :key="star"
                    :value="star"
                    :id="`${star}-star`"
                    name="rating"
                    type="radio"
                    class="rating__input rating__input--hidden"
                >
                <label
                    :key="star"
                    :for="`${star}-star`"
                    class="rating__label"
                >
                    <span
                        class="rating__icon"
                        aria-hidden="true"
                    />
                </label>
            </template>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            stars: new Array(5).fill(0).map((i, index) => index + 1).reverse(),
        };
    }
}
</script>
