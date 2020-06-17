<style lang="css">
    @import url('https://fonts.googleapis.com/css?family=Quicksand:400,700&display=swap');
</style>

<style lang="less" scoped>
@color: #c7254e;

main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Quicksand', sans-serif;
    font-weight: bold;
    line-height: 1.5;
}

.box {
    display: flex;
    align-items: center;
    margin: 25px 0;
    width: 300px;
    user-select: none;

    label {
        position: absolute;
        z-index: 10;
        padding-left: 50px;
        font-size: 26px;
        color: #4D4D4D;
        cursor: pointer;
    }

    input {
        position: absolute;
        opacity: 0;
        visibility: hidden;

        &:checked {

            ~ .check {
                box-shadow: 0px 0px 0px 15px @color inset;
            }
        }
    }

    .check {
        width: 30px;
        height: 30px;
        border: 2px solid @color;
        border-radius: 50%;
        background-color: #FFF;
        box-shadow: 0px 0px 0px 0px @color inset;
        transition: all 0.15s cubic-bezier(0, 1.05, 0.72, 1.07);
    }
}
</style>

<template>
    <main>
        <div>
            <div class="box">
                <input id="one" type="checkbox">
                <span class="check"></span>
                <label for="one">Check me.</label>
            </div>
            <div class="box">
                <input id="two" type="checkbox">
                <span class="check"></span>
                <label for="two">Hey! Check me too.</label>
            </div>
        </div>
    </main>
</template>

<script>
    export default {};
</script>
