<style lang="sass" scoped>
@supports(-webkit-appearance: none) or (-moz-appearance: none) {
    input[type='checkbox'],
    input[type='radio'] {
        --active: #5628EE;
        --active-inner: #fff;
        --input-border: #CDD9ED;
        --input-border-hover: #23C4F8;
        --background: #fff;
        --disabled: #F5F9FF;
        --disabled-inner: #E4ECFA;
        --shadow-inner: rgba(18, 22, 33, .1);
        height: 21px;
        outline: none;
        position: relative;
        -webkit-appearance: none;
        -moz-appearance: none;
        margin: 0;
        padding: 0;
        box-shadow: none;
        cursor: pointer;
        height: 21px;
        border: 1px solid var(--input-border);
        background: var(--background);
        transition: background .3s ease, border-color .3s ease;
        &:after {
            content: '';
            display: block;
            left: 0;
            top: 0;
            position: absolute;
            transition: transform .3s ease, opacity .2s ease, filter .3s ease;
        }
        &:checked {
            background: var(--active);
            border-color: var(--active);
            &:after {
                filter: drop-shadow(0 1px 2px var(--shadow-inner));
                transition: opacity .3s ease, filter .3s ease, transform .6s cubic-bezier(.175, .88, .32, 1.2);
            }
        }
        &:disabled {
            cursor: not-allowed;
            opacity: .9;
            background: var(--disabled);
            &:checked {
                background: var(--disabled-inner);
                border-color: var(--input-border);
            }
        }
        &:hover {
            &:not(:checked) {
                &:not(:disabled) {
                    border-color: var(--input-border-hover);
                }
            }
        }
        &:not(.switch) {
            width: 21px;
            &:after {
                opacity: 0;
            }
            &:checked {
                &:after {
                    opacity: 1;
                }
            }
        }
    }
    input[type='checkbox'] {
        &:not(.switch) {
            border-radius: 6px;
            &:after {
                width: 5px;
                height: 9px;
                border: 2px solid var(--active-inner);
                border-top: 0;
                border-left: 0;
                left: 7px;
                top: 4px;
                transform: rotate(20deg);
            }
            &:checked {
                &:after {
                    transform: rotate(43deg);
                }
            }
        }
        &.switch {
            width: 38px;
            border-radius: 11px;
            &:after {
                left: 2px;
                top: 2px;
                border-radius: 50%;
                width: 15px;
                height: 15px;
                background: var(--input-border);
            }
            &:checked {
                &:after {
                    background: var(--active-inner);
                    transform: translateX(17px);
                }
            }
            &:disabled {
                &:not(:checked) {
                    &:after {
                        opacity: .6;
                    }
                }
            }
        }
    }
    input[type='radio'] {
        border-radius: 50%;
        &:after {
            width: 19px;
            height: 19px;
            border-radius: 50%;
            background: var(--active-inner);
            opacity: 0;
            transform: scale(.7);
        }
        &:checked {
            &:after {
                background: var(--active-inner);
                transform: scale(.5);
            }
        }
    }
}

ul {
    margin: 12px;
    padding: 0;
    list-style: none;
    width: 100%;
    max-width: 360px;
    li {
        margin: 12px 0;
        padding-left: 48px;
        position: relative;
        input[type='checkbox'],
        input[type='radio'] {
            position: absolute;
            left: 0;
            top: 0;
        }
        input[type='text'] {
            line-height: 21px;
            border: 0;
            margin: 0;
            padding: 0;
            font-size: 12px;
            color: #6C7486;
            background: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            outline: none;
            width: 100%;
            font-family: 'Source Sans Pro', Arial;
        }
    }
}

ul {
    box-sizing: border-box;
}

* {
    box-sizing: inherit;
    &:before,
    &:after {
        box-sizing: inherit;
    }
}
</style>

<template>
    <main>
        <ul>
            <li>
                <input type="checkbox">
                <input type="text" readonly value='<input type="checkbox">'>
            </li>
            <li>
                <input type="checkbox" checked>
                <input type="text" readonly value='<input type="checkbox" checked>'>
            </li>
            <li>
                <input type="radio" name="radio" value="1">
                <input type="text" readonly value='<input type="radio">'>
            </li>
            <li>
                <input type="radio" name="radio" value="2" checked>
                <input type="text" readonly value='<input type="radio" checked>'>
            </li>
            <li>
                <input type="checkbox" class="switch">
                <input type="text" readonly value='<input type="checkbox" class="switch">'>
            </li>
            <li>
                <input type="checkbox" class="switch" checked>
                <input type="text" readonly value='<input type="checkbox" class="switch" checked>'>
            </li>
        </ul>

        <ul>
            <li>
                <input type="checkbox" disabled>
                <input type="text" readonly value='<input type="checkbox" disabled>'>
            </li>
            <li>
                <input type="checkbox" checked disabled>
                <input type="text" readonly value='<input type="checkbox" checked disabled>'>
            </li>
            <li>
                <input type="radio" name="radio1" value="1" disabled>
                <input type="text" readonly value='<input type="radio" disabled>'>
            </li>
            <li>
                <input type="radio" name="radio1" value="2" checked disabled>
                <input type="text" readonly value='<input type="radio" checked disabled>'>
            </li>
            <li>
                <input type="checkbox" class="switch" disabled>
                <input type="text" readonly value='<input type="checkbox" class="switch" disabled>'>
            </li>
            <li>
                <input type="checkbox" class="switch" checked disabled>
                <input type="text" readonly value='<input type="checkbox" class="switch" checked disabled>'>
            </li>
        </ul>
    </main>
</template>

<script>
export default {}
</script>
