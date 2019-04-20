<style lang="less" scoped>
    div {
        margin: 10px auto;
    }

    .circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: red;
    }

    .oval {
        width: 100px;
        height: 50px;
        border-radius: 50px ~"/" 25px;
        background-color: red;
    }

    .cone {
        width: 0;
        height: 0;
        border-left: 70px solid transparent;
        border-right: 70px solid transparent;
        border-top: 100px solid red;
        border-radius: 50%;
    }

    .half-circle.top {
        width: 100px;
        height: 50px;
        border-radius: 50px 50px 0 0;
        background-color: red;
    }

    .half-oval.top {
        width: 100px;
        height: 25px;
        border-radius: 50% ~"/" 100% 100% 0 0;
        background-color: red;
    }

    .half-oval.left {
        width: 100px;
        height: 50px;
        border-radius: 100% 0 0 100% ~"/" 50%;
        background-color: red;
    }

    .half-oval.quarter {
        width: 100px;
        height: 50px;
        border-radius: 100% 0 0 0;
        background-color: red;
    }

    .capsule {
        width: 100px;
        height: 50px;
        border-radius: 50% ~"/" 100%;
        background-color: red;
    }

    .triangle-top-left {
        width: 0;
        height: 0;
        border-top: 100px solid red;
        border-right: 100px solid transparent;
    }

    .parallelogram {
        width: 150px;
        height: 100px;
        background: red;
        transform: skew(20deg);
    }

    .trapezoid {
        box-sizing: content-box;
        width: 100px;
        height: 0;
        border-right: 50px solid transparent;
        border-left: 50px solid transparent;
        border-bottom: 100px solid red;
    }

    .pentagram {
        position: relative;
        margin: 70px auto;
        display: block;
        width: 0px;
        height: 0px;
        border-right: 100px solid transparent;
        border-left: 100px solid transparent;
        border-bottom: 70px solid red;
        transform: rotate(35deg);
        color: red;
        &::before,
        &::after {
            content: "";
            position: absolute;
            display: block;
            width: 0;
            height: 0;
        }
        &::before {
            top: -45px;
            left: -65px;
            border-bottom: 80px solid red;
            border-left: 30px solid transparent;
            border-right: 30px solid transparent;
            transform: rotate(-35deg);
        }
        &::after {
            top: 3px;
            left: -105px;
            border-bottom: 70px solid red;
            border-right: 100px solid transparent;
            border-left: 100px solid transparent;
            transform: rotate(-70deg);
        }
    }

    .hexagonal-star {
        position: relative;
        width: 0;
        height: 0;
        margin-bottom: 40px;
        border-bottom: 100px solid red;
        border-right: 50px solid transparent;
        border-left: 50px solid transparent;
        &::after {
            content: "";
            position: absolute;
            top: 30px;
            left: -50px;
            border-top: 100px solid red; 
            border-right: 50px solid transparent;
            border-left: 50px solid transparent; 
        }
    }

    .paper-plane {
        width: 0;
        height: 0;
        border-top: 25px solid red; /* 设置相邻的两个边框，边框宽度小于其他两边 */
        border-right: 25px solid red;
        border-bottom: 50px solid transparent; /* 其他边框颜色设置为透明色，则其会被隐藏掉 */
        border-left: 50px solid transparent; 
    }

    .square {
        width: 100px;
        height: 100px;
        border: 20px solid red;
    }

    .elliptic-square {
        width: 100px;
        height: 100px;
        border: 20px solid red;
        border-radius: 20px;
    }

    .more-elliptic-square {
        width: 100px;
        height: 100px;
        border: 20px solid red;
        border-radius: 50px;
    }

    .hoe {
        width: 30px;
        height: 100px;
        border: 10px solid red;
        border-bottom-color: transparent;
        border-left-color: transparent;
    }

    .olecranon {
        width: 60px;
        height: 50px;
        border-top: 20px solid red;
        border-top-left-radius: 60px;
    }

    .horns {
        width: 50px;
        height: 80px;
        border-right: 20px solid red;
        border-left: 20px solid red;
        border-radius: 20px ~"/" 30px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .heart {
        position: relative;
        top: 40px;
        width: 100px;
        height: 100px;
        background-color: red;
        transform: rotate(-45deg);
        &::before,
        &::after {
            content: "";
            position: absolute;
            background: inherit;
        }
        &::before {
            width: 100px;
            height: 50px;
            top: -49px;
            border-radius: 50px 50px 0 0;
        }
        &::after {
            width: 50px;
            height: 100px;
            right: -49px;
            border-radius: 0 50px 50px 0;
        }
    }
</style>

<template>
    <main>
        <ul>
            <li>
                <div class="circle"></div>
                <pre class="pre-code">
                    <code>
                        .circle {
                            width: 100px;
                            height: 100px;
                            border-radius: 50%;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="oval"></div>
                <pre class="pre-code">
                    <code>
                        .oval {
                            width: 100px;
                            height: 50px;
                            border-radius: 50px / 25px;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="cone"></div>
                <pre class="pre-code">
                    <code>
                        .cone {
                            width: 0;
                            height: 0;
                            border-left: 70px solid transparent;
                            border-right: 70px solid transparent;
                            border-top: 100px solid red;
                            border-radius: 50%;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="half-circle top"></div>
                <pre class="pre-code">
                    <code>
                        .half-circle.top {
                            width: 100px;
                            height: 50px;
                            border-radius: 50px 50px 0 0;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="half-oval top"></div>
                <pre class="pre-code">
                    <code>
                        .half-oval.top {
                            width: 100px;
                            height: 25px;
                            border-radius: 50% / 100% 100% 0 0;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="half-oval left"></div>
                <pre class="pre-code">
                    <code>
                        .half-oval.left {
                            width: 100px;
                            height: 50px;
                            border-radius: 100% 0 0 100% / 50%;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="half-oval quarter"></div>
                <pre class="pre-code">
                    <code>
                        .half-oval.quarter {
                            width: 100px;
                            height: 50px;
                            border-radius: 100% 0 0 0;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="capsule"></div>
                <pre class="pre-code">
                    <code>
                        .capsule {
                            width: 100px;
                            height: 50px;
                            border-radius: 50% / 100%;
                            background-color: red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="triangle-top-left"></div>
                <pre class="pre-code">
                    <code>
                        .triangle-top-left {
                            width: 0;
                            height: 0;
                            border-top: 100px solid red;
                            border-right: 100px solid transparent;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="parallelogram"></div>
                <pre class="pre-code">
                    <code>
                        .parallelogram {
                            width: 150px;
                            height: 100px;
                            margin-left: 20px;
                            background: red;
                            transform: skew(20deg);
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="trapezoid"></div>
                <pre class="pre-code">
                    <code>
                        .trapezoid {
                            box-sizing: content-box;
                            width: 100px;
                            height: 0;
                            border-right: 50px solid transparent;
                            border-left: 50px solid transparent;
                            border-bottom: 100px solid red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="pentagram"></div>
                <pre class="pre-code">
                    <code>
                        .pentagram {
                            position: relative;
                            margin: 70px auto;
                            display: block;
                            width: 0px;
                            height: 0px;
                            border-right: 100px solid transparent;
                            border-left: 100px solid transparent;
                            border-bottom: 70px solid red;
                            transform: rotate(35deg);
                            color: red;
                            &::before,
                            &::after {
                                content: "";
                                position: absolute;
                                display: block;
                                width: 0;
                                height: 0;
                            }
                            &::before {
                                top: -45px;
                                left: -65px;
                                border-bottom: 80px solid red;
                                border-left: 30px solid transparent;
                                border-right: 30px solid transparent;
                                transform: rotate(-35deg);
                            }
                            &::after {
                                top: 3px;
                                left: -105px;
                                border-bottom: 70px solid red;
                                border-right: 100px solid transparent;
                                border-left: 100px solid transparent;
                                transform: rotate(-70deg);
                            }
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="hexagonal-star"></div>
                <pre class="pre-code">
                    <code>
                        .hexagonal-star {
                            position: relative;
                            width: 0;
                            height: 0;
                            margin-bottom: 40px;
                            border-bottom: 100px solid red;
                            border-right: 50px solid transparent;
                            border-left: 50px solid transparent;
                            &::after {
                                position: absolute;
                                top: 30px;
                                left: -50px;
                                border-top: 100px solid red; 
                                border-right: 50px solid transparent;
                                border-left: 50px solid transparent; 
                            }
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="paper-plane"></div>
                <pre class="pre-code">
                    <code>
                        .paper-plane {
                            width: 0;
                            height: 0;
                            border-top: 25px solid red; /* 设置相邻的两个边框，边框宽度小于其他两边 */
                            border-right: 25px solid red;
                            border-bottom: 50px solid transparent; /* 其他边框颜色设置为透明色，则其会被隐藏掉 */
                            border-left: 50px solid transparent; 
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="square"></div>
                <pre class="pre-code">
                    <code>
                        .square {
                            width: 100px;
                            height: 100px;
                            border: 20px solid red;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="elliptic-square"></div>
                <pre class="pre-code">
                    <code>
                        .elliptic-square {
                            width: 100px;
                            height: 100px;
                            border: 20px solid red;
                            border-radius: 20px;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="more-elliptic-square"></div>
                <pre class="pre-code">
                    <code>
                        .more-elliptic-square {
                            width: 100px;
                            height: 100px;
                            border: 20px solid red;
                            border-radius: 50px;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="hoe"></div>
                <pre class="pre-code">
                    <code>
                        .hoe {
                            width: 30px;
                            height: 100px;
                            border: 10px solid red;
                            border-bottom-color: transparent;
                            border-left-color: transparent;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="olecranon"></div>
                <pre class="pre-code">
                    <code>
                        .olecranon {
                            width: 60px;
                            height: 50px;
                            border-top: 20px solid red;
                            border-top-left-radius: 60px;
                        }
                    </code>
                </pre>
            </li>
            <li>
                <div class="horns"></div>
                <pre class="pre-code">
                    <code>
                        .horns {
                            width: 50px;
                            height: 80px;
                            border-right: 20px solid red;
                            border-left: 20px solid red;
                            border-radius: 20px / 30px;
                            border-bottom-left-radius: 0;
                            border-bottom-right-radius: 0;
                        }
                    </code>
                </pre>
            </li>

            <li>
                <div class="heart"></div>
            </li>
        </ul>
    </main>
</template>

<script>
    export default {}
</script>
