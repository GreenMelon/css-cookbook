<style lang="less" scoped>
nav {
	position: relative;
	margin: 30px auto;
	width: 590px;
	height: 50px;
	font-size: 0;
	border-radius: 8px;
	background-color: #34495e;
}
nav a {
	display: inline-block;
	position: relative;
	z-index: 1;
	height: 100%;
	font-size: 15px;
	line-height: 50px;
	text-align: center;
	text-transform: uppercase;
	text-decoration: none;
	color: white;
	cursor: pointer;
}
nav .animation {
	position: absolute;
	top: 0;
	z-index: 0;
	height: 100%;
	border-radius: 8px;
	transition: all .5s ease 0s;
}
a:nth-child(1) {
	width: 100px;
}
a:nth-child(2) {
	width: 110px;
}
a:nth-child(3) {
	width: 100px;
}
a:nth-child(4) {
	width: 160px;
}
a:nth-child(5) {
	width: 120px;
}
nav .start-home,
a:nth-child(1):hover ~ .animation {
	left: 0;
	width: 100px;
	background-color: #1abc9c;
}
a:nth-child(2):hover ~ .animation {
	left: 100px;
	width: 110px;
	background-color: #e74c3c;
}
a:nth-child(3):hover~.animation {
	left: 210px;
	width: 100px;
	background-color: #3498db;
}
a:nth-child(4):hover~.animation {
	left: 310px;
	width: 160px;
	background-color: #9b59b6;
}
a:nth-child(5):hover~.animation {
	left: 470px;
	width: 120px;
	background-color: #e67e22;
}
</style>

<template>
    <main>
        <nav>
            <a href="#1">Home</a>
            <a href="#2">About</a>
            <a href="#3">Blog</a>
            <a href="#4">Portefolio</a>
            <a href="#5">Contact</a>
            <div class="animation start-home"></div>
        </nav>
    </main>
</template>

<script>
export default {}
</script>
