<style lang="less" scoped>
main {
    position: relative;
	margin: 0;
	font-family: "Exo", sans-serif;
	color: #fff;
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradientBG 15s ease infinite;
}

.container {
    position: absolute;
	top: 35%;
	width: 100%;
	text-align: center;
}

h1 {
	font-weight: 300;
}

@keyframes gradientBG {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

</style>

<template>
    <main>
        <div class="container">
            <h1>Pure CSS Animated Gradient Background</h1>
        </div>
    </main>
</template>

<script>
export default {}
</script>
