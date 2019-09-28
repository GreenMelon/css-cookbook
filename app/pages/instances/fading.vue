<style lang="less">
main {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em;
    text-align: center;
}

.fancy {
    margin: 0;
    font-size: 1.5rem;
    letter-spacing: 1rem;
    text-transform: uppercase;
    color: #007dd4;
    span {
        opacity: 0;
        animation: fadeIn 2s alternate infinite;
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        filter: blur(10px);
    }
    50%,
    100% {
        opacity: 1;
        filter: blur(0px);
    }
}
</style>

<template>
    <main>
        <h1 class="fancy">The Fancy Heading</h1>
    </main>
</template>

<script>
    export default {
        mounted() {
            this.fading();
        },

        methods: {
            fading() {
                const fancy = document.getElementsByClassName('fancy')[0];
                const letters = fancy.textContent.split('');

                const content = letters.map(val => {
                    const delay = Math.floor((Math.random() * 1000) + 1);

                    return `<span style="animation-delay: ${delay}ms">${val}</span>`;
                });

                fancy.innerHTML = '';

                for (var i = 0; i < content.length; i++) {
                    fancy.innerHTML += content[i];
                }
            },
        },
    };
</script>
