<style lang="less" scoped>
.loader {
    position: relative;
}
.line-wrap {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100px;
    height: 50px;
    overflow: hidden;
    transform-origin: 50% 100%;
    animation: spin 2000ms cubic-bezier(.175, .885, .32, 1.275) infinite;
}
.line {
    position: absolute;
    right: 0;
    left: 0;
    box-sizing: border-box;
    margin: 0 auto;
    border: 4px solid transparent;
    border-radius: 100%;
}
.line-wrap:nth-child(1) { animation-delay: -50ms; }
.line-wrap:nth-child(2) { animation-delay: -100ms; }
.line-wrap:nth-child(3) { animation-delay: -150ms; }
.line-wrap:nth-child(4) { animation-delay: -200ms; }
.line-wrap:nth-child(5) { animation-delay: -250ms; }

.line-wrap:nth-child(1) .line {
    top: 7px;
    width: 90px;
    height: 90px;
    border-color: #eb4747;
}
.line-wrap:nth-child(2) .line {
    top: 14px;
    width: 76px;
    height: 76px;
    border-color: #ebeb47;
}
.line-wrap:nth-child(3) .line {
    top: 21px;
    width: 62px;
    height: 62px;
    border-color: #47eb47;
}
.line-wrap:nth-child(4) .line {
    top: 28px;
    width: 48px;
    height: 48px;
    border-color: #47ebeb;
}
.line-wrap:nth-child(5) .line {
    top: 35px;
    width: 34px;
    height: 34px;
    border-color: #4747eb;
}
@keyframes spin {
    0% {
		transform: rotate(0);
    }
    15% {
		transform: rotate(0);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>

<template>
    <main>
        <div class="loader">
            <!-- <div class="loader-inner"> -->
                <div class="line-wrap">
                    <div class="line"></div>
                </div>
                <div class="line-wrap">
                    <div class="line"></div>
                </div>
                <div class="line-wrap">
                    <div class="line"></div>
                </div>
                <div class="line-wrap">
                    <div class="line"></div>
                </div>
                <div class="line-wrap">
                    <div class="line"></div>
                </div>
            <!-- </div> -->
        </div>
    </main>
</template>

<script>
export default {}
</script>
