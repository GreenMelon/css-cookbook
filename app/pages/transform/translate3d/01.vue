<style lang="less" scoped>
main {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
    font-size: 14px;
}

.background {
  position: relative;
  background: linear-gradient(to bottom, #b8b8ff 0%,#4c4ba2 100%);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px 0 rgba(0,0,0,0.25);
  width: 400px;
  height: 400px;
}

.ball {
  background-color: white;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  margin-bottom: 3px;
  animation: dot 1s ease-in-out infinite;
}

@keyframes dot {
    0% {
        transform: translate3d(50px, 0, 0);
	}
	50% {
        transform: translate3d(-50px, 0, 0);
    }
    100% {
        transform: translate3d(50px, 0, 0);
	}
}

.ball1 {
    animation: dot 1016.9491525424ms ease-in-out infinite;
}
.ball2 {
    animation: dot 1034.4827586207ms ease-in-out infinite;
}
.ball3 {
    animation: dot 1052.6315789474ms ease-in-out infinite;
}
.ball4 {
    animation: dot 1071.4285714286ms ease-in-out infinite;
}
.ball5 {
    animation: dot 1090.9090909091ms ease-in-out infinite;
}
.ball6 {
    animation: dot 1111.1111111111ms ease-in-out infinite;
}
.ball7 {
    animation: dot 1132.0754716981ms ease-in-out infinite;
}
.ball8 {
    animation: dot 1.15385s ease-in-out infinite;
}
.ball9 {
    animation: dot 1.17647s ease-in-out infinite;
}
.ball10 {
    animation: dot 1.2s ease-in-out infinite;
}
.ball11 {
    animation: dot 1.22449s ease-in-out infinite;
}
.ball12 {
    animation: dot 1.25s ease-in-out infinite;
}
.ball13 {
    animation: dot 1.2766s ease-in-out infinite;
}
.ball14 {
    animation: dot 1.30435s ease-in-out infinite;
}
.ball15 {
    animation: dot 1.33333s ease-in-out infinite;
}
.ball16 {
    animation: dot 1.36364s ease-in-out infinite;
}
.ball17 {
    animation: dot 1.39535s ease-in-out infinite;
}
.ball18 {
    animation: dot 1.42857s ease-in-out infinite;
}
.ball19 {
    animation: dot 1.46341s ease-in-out infinite;
}
.ball20 {
    animation: dot 1.5s ease-in-out infinite;
}
</style>

<template>
    <main>
        <div class="background">
            <div class="ball ball1"></div>
            <div class="ball ball2"></div>
            <div class="ball ball3"></div>
            <div class="ball ball4"></div>
            <div class="ball ball5"></div>
            <div class="ball ball6"></div>
            <div class="ball ball7"></div>
            <div class="ball ball8"></div>
            <div class="ball ball9"></div>
            <div class="ball ball10"></div>

            <div class="ball ball11"></div>
            <div class="ball ball12"></div>
            <div class="ball ball13"></div>
            <div class="ball ball14"></div>
            <div class="ball ball15"></div>
            <div class="ball ball16"></div>
            <div class="ball ball17"></div>
            <div class="ball ball18"></div>
            <div class="ball ball19"></div>
            <div class="ball ball20"></div>
        </div>
    </main>
</template>

<script>
    export default {};
</script>
