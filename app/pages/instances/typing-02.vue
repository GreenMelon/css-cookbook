<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    font-size: 32px;
}

.typity {
    position: relative;
    padding-right: 2px;
    border-bottom: 3px solid red;
    white-space: nowrap;
    transition: background-position .4s;
    &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        width: 2px;
        height: 100%;
        background-color: transparent;
        animation: blink-cursor .75s step-end infinite;
    }

    &.highlight {
        background-image: linear-gradient(to left, rgba(0, 0, 0, 0.2) 50%, transparent 50%);
        background-position: 100%;
        background-size: 200% 100%;
        &::after {
            animation: none;
        }
    }
}

@keyframes blink-cursor {
    0% {
        background-color: transparent;
    }
    50% {
        background-color: black;
    }
}

@media only screen and (max-width: 600px) {
    main {
        font-size: 12px;
    }

    .typity {
        padding-right: 1px;
        border-bottom: 1px solid red;
        &::after {
            width: 1px;
        }
    }
}
</style>

<template>
    <main>
        <span class="typity"></span>
    </main>
</template>

<script>
    export default {
        mounted() {
            this.begin();
        },

        methods: {
            begin() {
                let typed = '';
                const element = document.querySelector('.typity');

                function startType(pun, index) {
                    if (index < pun.length) {
                        typed += pun.charAt(index);
                        element.innerHTML = typed;
                        index++;
                        setTimeout(function() {
                            startType(pun, index);
                        }, 50);
                    } else {
                        setTimeout(function() {
                            element.classList.add('highlight');
                        }, 1000);

                        setTimeout(function() {
                            element.classList.remove('highlight');
                            typed = '';
                            element.innerHTML = typed;
                            startType(getRandomPun(), 0);
                        }, 2000);
                    }
                }

                function getRandomPun() {
                    const puns = [
                        'I love three things',
                        'the sun, the moon and you',
                        'the sun is for the day',
                        'the moon is for the night',
                        'and you forever'
                    ];

                    const index = Math.floor(Math.random() * puns.length);
                    return puns[index];
                }

                startType(getRandomPun(), 0);
            },
        },
    };
</script>
