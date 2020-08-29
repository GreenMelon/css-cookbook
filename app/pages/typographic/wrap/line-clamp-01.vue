<style lang="less" scoped>
    li {
        margin-top: 20px;
    }

    .line-clamp {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .after {
        position: relative;
        height: 2.8em;  //高度为行高的两倍正好显示两行
        line-height: 1.4em;
        overflow: hidden;
    }
    .after:after {
        content: "...";
        position: absolute;
        bottom: 0;
        right: 0;
        padding-left: 4px;
        font-weight: bold;
        background: #fff;
    }

    .text-overflow {
        height: 2.2em;
        line-height: 1.2em;
        overflow: hidden;
        zoom:1;
    }
    .content {
        float: left;
        overflow: hidden;
        height: 2.2em;
        margin-right: 3em;
    }
    .dot {
        float: right;
        width: 3em;
        height: 2.2em;
        margin-top: -1.2em;
    }
</style>

<template>
    <main>
        <h1>多行文本溢出显示省略号</h1>
        <ul>
            <li>
                <h2>-webkit-line-clamp</h2>
                <div class="line-clamp">-webkit-line-clamp 是一个 不规范的属性（unsupported WebKit property），它没有出现在 CSS 规范草案中。限制在一个块元素显示的文本的行数。 为了实现该效果，它需要组合其他外来的WebKit属性。-webkit-line-clamp 是一个 不规范的属性（unsupported WebKit property），它没有出现在 CSS 规范草案中。限制在一个块元素显示的文本的行数。 为了实现该效果，它需要组合其他外来的WebKit属性。</div>
            </li>
            <li>
                <h2>伪元素 ::after</h2>
                <!-- 内容必须溢出，且省略号的位置需要调整 -->
                <div class="after">-webkit-line-clamp 是一个 不规范的属性（unsupported WebKit property），它没有出现在 CSS 规范草案中。限制在一个块元素显示的文本的行数。 为了实现该效果，它需要组合其他外来的WebKit属性。-webkit-line-clamp 是一个 不规范的属性（unsupported WebKit property），它没有出现在 CSS 规范草案中。限制在一个块元素显示的文本的行数。 为了实现该效果，它需要组合其他外来的WebKit属性。</div>
            </li>
            <li>
                <h2>margin负值定位</h2>
                <div class="text-overflow">
                    <div class="content">兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器兼容所有主流浏览器</div>
                    <div class="dot">...</div>
                </div>
            </li>
            <li>
                <h2>
                    <a href="https://github.com/josephschmitt/Clamp.js">Clamp.js</a>
                </h2>
                <pre class="pre-code">
                    <code>
                        var module = document.getElementById("clamp-this-module");
                        $clamp(module, {clamp: 2});
                    </code>
                </pre>
            </li>
            <li>
                <h2>
                    <a href="https://github.com/BeSite/jQuery.dotdotdot">jQuery.dotdotdot</a>
                </h2>
                <pre class="pre-code">
                    <code>
                        $(document).ready(function() {
                            $("#wrapper").dotdotdot({
                                //
                            });
                        });
                    </code>
                </pre>
            </li>
        </ul>
    </main>
</template>

<script>
export default {}
</script>
