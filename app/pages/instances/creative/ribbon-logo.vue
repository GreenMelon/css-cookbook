<style lang="less" scoped>
.gaoding {
    display: flex;
    justify-content: center;
    align-items: center;
}
.G,
.D {
    position: relative;
    margin-left: 50px;
    width: 72px;
    transform: scale(2);
}
.G {
    .ribbon {
        &:nth-child(2) {
            top: 54px;
            left: -54px;
            transform: rotate(270deg);
        }
        &:nth-child(3) {
            top: 108px;
            left: 0px;
            transform: rotate(180deg);
        }
        &:nth-child(4) {
            top: 78px;
            left: 30px;
            transform: rotate(90deg);
        }
        &:nth-child(5) {
            top: 48px;
            left: 24px;
        }
    }
}
.D {
    .ribbon {
        &:nth-child(1) {
            top: 42px;
            left: -24px;
            transform: rotate(270deg);
        }
        &:nth-child(2) {
            top: 0px;
            left: 18px;
        }
        &:nth-child(3) {
            top: 54px;
            left: 24px;
            transform: rotate(90deg);
        }
        &:nth-child(4) {
            top: 108px;
            left: 18px;
            transform: rotate(180deg);
        }
    }
}
</style>

<template>
    <main>
        <div class="gaoding">
            <div class="G">
                <ribbon
                    :size="12"
                    :times="4"
                    color="#e91a8c"
                />
                <ribbon
                    :size="12"
                    :times="8"
                    :z-index="1"
                    color="#7f00ff"
                />
                <ribbon
                    :size="12"
                    :times="4"
                    color="#411ad6"
                />
                <ribbon
                    :size="12"
                    :times="4"
                    :z-index="1"
                    color="#ff7f00"
                />
                <ribbon
                    :size="12"
                    :times="2"
                    color="#5ceaa2"
                />
            </div>
            <div class="D">
                <ribbon
                    :size="12"
                    :times="6"
                    :z-index="1"
                    color="gold"
                />
                <ribbon
                    :size="12"
                    :times="4"
                    color="crimson"
                />
                <ribbon
                    :size="12"
                    :times="8"
                    :z-index="1"
                    color="orange"
                />
                <ribbon
                    :size="12"
                    :times="4"
                    color="pink"
                />
            </div>
        </div>
    </main>
</template>

<script>
    import ribbon from './ribbon';

    export default {
        components: {
            ribbon,
        },
    };
</script>
