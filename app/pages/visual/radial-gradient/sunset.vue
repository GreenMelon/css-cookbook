<style lang="css" scoped>
main {
    position: relative;
    background:
        radial-gradient(
			circle,
			transparent 0,
			transparent 20%,
			black 0,
			black 100%
		),
		linear-gradient(gold, orange, orangered, orangered);
}

div {
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	bottom: 0;
	backdrop-filter: blur(15vmin);
}

</style>

<template>
    <main>
        <div></div>
    </main>
</template>

<script>
export default {}
</script>
