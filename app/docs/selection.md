# 焦点光标

- 文本框焦点光标位置、选中起始位置、终止位置、选择内容
http://blog.csdn.net/itdragons/article/details/52186058

文本选中区域光标：页面中闪烁的光标其实就是特殊的宽度为0的选区。 简单理解就是选区的左右边界交叉形成了光标。

input元素的两个属性
selectionStart 选区开始位置
selectionEnd 选区结束位置
input.focus()

input.selectionStart = 0;   //选中区域左边界
input.selectionEnd = input.value.length; //选中区域右边界
上面的代码可以选中输入框的全部内容。 等同于input.select();

获取选中的文本内容
var selection = input.value.substring(input.selectionStart,input.selectionEnd);

IE浏览器下的实现
IE下对于文本流的处理提供了更加强大的支持。
var range = input.createTextRange();        //创建一个文本选区对象。
这个选区对象默认包含了input的全部文本内容。
需要注意的是，这个选区对象是一个抽象的区域
在调用range.select()方法之前，选区对象的内容并不会被选中。
range.select();   //将选区对象包含的内容选中。
我们可以用  range.text属性得到选中的文字
选区有两个类似于上面selectionStart和selectionEnd属性的方法
moveStart和moveEnd方法。

range.moveStart("character",2); //左边界右移两个字符 。   character--字符
range.select();  //将range包含的区域选中。

moveStart和moveEnd都要传入两个参数，第一个参数可选值有 character、word、sentence、textedit. 这里我们只用到character，即根据字符来偏移。 第二个参数代表偏移的多少，正负表示方向。
我们知道左边界最初默认是0，右边界默认是文本内容长度值。

还有一个很有用的方法 collapse， 见名知意，就是将选区对象的范围压缩，下面详细介绍。
collapse可以传入一个布尔值作为参数,参数默认值为true，指示向左还是向右压缩。

var range = input.createTextRange(); //创建选区对象
//此时选区对象的左边界为0,右边界为input.value.length;
range.collapse();
//此时选区对象左边界为0，右边界为0； 相当于将选区向左收缩了,即使右边界下标等于左边界下标。
//左右边界重合,可以显示光标。
range.select();
collapse(true)相当于让右边界下标等于左边界下标。
再试看看collapse(false）
var range = input.createTextRange(); //创建选区对象
//此时选区对象的左边界为0,右边界为input.value.length;
range.collapse(false);
//此时选区对象左边界为input.value.length，右边界为input.value.length； 相当于将选区向右收缩了,即使左边界下标等于右边界下标。
//左右边界重合,可以显示光标。
range.select();
还有一个move方法

## ::selection


连续调用两次focus会导致光标失去
把document.selection放在前面

http://blog.csdn.net/truong/article/details/18658895
https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getSelection
http://jm1999.iteye.com/blog/2317291
http://www.cnblogs.com/yanze/p/6001951.html


