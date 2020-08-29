<style lang="less" scoped>
    .email {
        &::before {
            content: attr(data-done) " Email: ";
        }
    }

    .coffee {
        &::after {
            // content: " $ " calc(attr(data-price) * attr(data-sale-modifier));
            content: calc(4 * 0.9);
            // content: "1" . "2" . "3";
            // content: "1" + "2" + "3";
            content: "1" "2" "3";
            content: "1 2 3";
        }
    }

    .avatar {
        &::before {
            content: url(~images/superman.png);
        }
    }
</style>

<template>
    <main>
        <div
            data-done="&#x2705;"
            class="email">caigua@gmail.com
        </div>

        <div
            data-price="4"
            data-sale-modifier="0.9"
            class="coffee">Coffee
        </div>

        <div class="avatar">avatar</div>
    </main>
</template>

<script>
export default {}
</script>
