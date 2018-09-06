# font-display

## @font-face 规则的字体触发下载

- 合法的 @font-face 规则，并且当前浏览器需要支持 src 列表中给出的格式
- 文档中有节点使用了 @font-face 中相同的 font-family
- 在 Webkit 和 Blink 引擎中，使用该 font-family 的节点不能为空
- @font-face 中指定了 unicode-range，出现的文字内容还必须落在设定的 Unicode 范围中

## font-display 属性值

```css
@font-face {
  font-family: 'Arvo';
  font-display: auto;
  src: local('Arvo'), url(https://fonts.gstatic.com/s/arvo/v9/rC7kKhY-eUDY-ucISTIf5PesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');
}
```

- auto：使用浏览器默认的行为
- block：浏览器首先使用隐形文字替代页面上的文字，并等待字体加载完成再显示
- swap：如果设定的字体还未可用，浏览器将首先使用备用字体显示，当设定的字体加载完成后替换备用字体
- fallback：与 swap 属性值行为上大致相同，但浏览器会给设定的字体设定加载的时间限制，一旦加载所需的时长大于这个限制，设定的字体将不会替换备用字体进行显示。 Webkit 和 Firefox 中设定此时间为 3s；
- optional：使用此属性值时，如果设定的字体没有在限制时间内加载完成，当前页面将会一直使用备用字体，并且设定字体继续在后台进行加载，以便下一次浏览时可以直接使用设定的字体。

## CSS Font Loading API

[CSS Font Loading Module Level 3](https://drafts.csswg.org/css-font-loading/)

```javascript
// FontFace 接口加载字体
const Aclonica = new FontFace('Aclonica', 'url(./Aclonica.ttf)');

// 添加到全局的 FontFaceSet 中
document.fonts.add(Aclonica);

Aclonica.load().then(() => {
    // 当字体加载完之后，我们就可以通过替换 class 的方法替换掉默认的字体
    // 此处的逻辑也可以是你的字体渲染策略
    document.body.classList.add('use-aclonica');
});
```

## 参考

- [font-display 的使用](https://mp.weixin.qq.com/s?__biz=MzA3MTk1MzIxOQ==&mid=2663380935&idx=1&sn=0fdbdc44e65caec53dbc33e3e4b76114&chksm=846ee9ebb31960fd5a715a43c4ca93a9cceb1587bcf4b861aa296b0b85b7c96758004e9f56cd#rd)
-  [A COMPREHENSIVE GUIDE TO FONT LOADING STRATEGIES](https://www.zachleat.com/web/comprehensive-webfonts/)
