# Responsive

```
/* 为适配手机尺寸而引入 */
@media only screen and (max-width: 240px) { ... }
@media only screen and (min-width: 241px) and (max-width: 360px) { ... }
@media only screen and (min-width: 361px) and (max-width: 480px) { ... }
@media only screen and (min-width: 481px) and (max-width: 799px) { ... }
@media only screen and (min-width: 800px) and (max-width: 1199px) { ... }

/* 为适配PC尺寸而引入 */
@media only screen and (min-width: 1200px) and (max-width: 1600px) { ... }
@media only screen and (min-width: 1601px) and (max-width: 2048px) { ... }
@media only screen and (min-width: 2049px) and (max-width: 5000px) { ... }

/**
 * 还可以增加一个媒体查询项，即设备的横竖屏状态
 * 该状态在下面会用到，而且是大有用处
 *
 * (orientation : landscape) 代表设备竖屏时，书写方式为：
 * @media only screen and (orientation : landscape) { ... }
 *
 * (orientation : portrait) 代表设备横屏时，书写方式为
 * @media only screen and (orientation : portrait) { ... }
 */
```

```
<!-- 为适配手机尺寸而引入 -->
<link rel="stylesheet" media="only screen and (max-width: 240px)" href="style-0-240.css">
<link rel="stylesheet" media="only screen and (min-width: 241px) and (max-width: 360px)" href="style-241-360.css">
<link rel="stylesheet" media="only screen and (min-width: 361px) and (max-width: 480px)" href="style-361-480.css">
<link rel="stylesheet" media="only screen and (min-width: 481px) and (max-width: 799px)" href="style-481-799.css">
<link rel="stylesheet" media="only screen and (min-width: 800px) and (max-width: 1199px)" href="style-800-1199.css">

<!-- 为适配PC尺寸而引入 -->
<link rel="stylesheet" media="only screen and (min-width: 1200px) and (max-width: 1600px)" href="style-1200-1600.css">
<link rel="stylesheet" media="only screen and (min-width: 1601px) and (max-width: 2048px)" href="style-1601-2048.css">
<link rel="stylesheet" media="only screen and (min-width: 2049px) and (max-width: 5000px)" href="style-2049-5000.css">
```