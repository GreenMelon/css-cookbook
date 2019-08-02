<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
}

.background {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 400px;
    border-radius: 5px;
    background: linear-gradient(to bottom, #404556 0%, #222 100%);
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.25);
}

.rectangle {
    position: absolute;
    border: 1px solid white;
}

.rec-1 {
    width: 200px;
    height: 200px;
    border-color: #4e4e4e;
    animation: rotate 2s ease-in-out 0.0333333333s alternate infinite;
}

.rec-2 {
    width: 190px;
    height: 190px;
    border-color: #565656;
    animation: rotate 2s ease-in-out 0.0666666667s alternate infinite;
}

.rec-3 {
    width: 180px;
    height: 180px;
    border-color: #5e5e5e;
    animation: rotate 2s ease-in-out 0.1s alternate infinite;
}

.rec-4 {
    width: 170px;
    height: 170px;
    border-color: #666666;
    animation: rotate 2s ease-in-out 0.1333333333s alternate infinite;
}

.rec-5 {
  height: 160px;
  width: 160px;
  border-color: #6e6e6e;
  animation: rotate 2s ease-in-out 0.1666666667s alternate infinite;
}

.rec-6 {
    width: 150px;
    height: 150px;
    border-color: #767676;
    animation: rotate 2s ease-in-out 0.2s alternate infinite;
}

.rec-7 {
    width: 140px;
    height: 140px;
    border-color: #7e7e7e;
    animation: rotate 2s ease-in-out 0.2333333333s alternate infinite;
}

.rec-8 {
    width: 130px;
    height: 130px;
    border-color: #868686;
    animation: rotate 2s ease-in-out 0.2666666667s alternate infinite;
}

.rec-9 {
    width: 120px;
    height: 120px;
    border-color: #8e8e8e;
    animation: rotate 2s ease-in-out 0.3s alternate infinite;
}

.rec-10 {
    width: 110px;
    height: 110px;
    border-color: #969696;
    animation: rotate 2s ease-in-out 0.3333333333s alternate infinite;
}

.rec-11 {
    width: 100px;
    height: 100px;
    border-color: #9e9e9e;
    animation: rotate 2s ease-in-out 0.3666666667s alternate infinite;
}

.rec-12 {
    width: 90px;
    height: 90px;
    border-color: #a6a6a6;
    animation: rotate 2s ease-in-out 0.4s alternate infinite;
}

.rec-13 {
    width: 80px;
    height: 80px;
    border-color: #aeaeae;
    animation: rotate 2s ease-in-out 0.4333333333s alternate infinite;
}

.rec-14 {
    width: 70px;
    height: 70px;
    border-color: #b6b6b6;
    animation: rotate 2s ease-in-out 0.4666666667s alternate infinite;
}

.rec-15 {
    width: 60px;
    height: 60px;
    border-color: #bebebe;
    animation: rotate 2s ease-in-out 0.5s alternate infinite;
}

.rec-16 {
    width: 50px;
    height: 50px;
    border-color: #c6c6c6;
    animation: rotate 2s ease-in-out 0.5333333333s alternate infinite;
}

.rec-17 {
    width: 40px;
    height: 40px;
    border-color: #cecece;
    animation: rotate 2s ease-in-out 0.5666666667s alternate infinite;
}

.rec-18 {
    width: 30px;
    height: 30px;
    border-color: #d6d6d6;
    animation: rotate 2s ease-in-out 0.6s alternate infinite;
}

.rec-19 {
    width: 20px;
    height: 20px;
    border-color: #dedede;
    animation: rotate 2s ease-in-out 0.6333333333s alternate infinite;
}

.rec-20 {
    width: 10px;
    height: 10px;
    border-color: #e6e6e6;
    animation: rotate 2s ease-in-out 0.6666666667s alternate infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>

<template>
    <main>
        <div class="background">
            <div class="rectangle rec-1"></div>
            <div class="rectangle rec-2"></div>
            <div class="rectangle rec-3"></div>
            <div class="rectangle rec-4"></div>
            <div class="rectangle rec-5"></div>
            <div class="rectangle rec-6"></div>
            <div class="rectangle rec-7"></div>
            <div class="rectangle rec-8"></div>
            <div class="rectangle rec-9"></div>
            <div class="rectangle rec-10"></div>
            <div class="rectangle rec-11"></div>
            <div class="rectangle rec-12"></div>
            <div class="rectangle rec-13"></div>
            <div class="rectangle rec-14"></div>
            <div class="rectangle rec-15"></div>
            <div class="rectangle rec-16"></div>
            <div class="rectangle rec-17"></div>
            <div class="rectangle rec-18"></div>
            <div class="rectangle rec-19"></div>
            <div class="rectangle rec-20"></div>
        </div>
    </main>
</template>

<script>
    export default {}
</script>
