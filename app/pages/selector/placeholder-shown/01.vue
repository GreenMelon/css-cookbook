<style lang="less" scoped>

div {
    position: relative;
    margin: 100px auto;
    display: flex;
    flex-wrap: wrap;
    width: 500px;
    height: 60px;
    overflow: hidden;
    transition: 0.3s;

    & > * {
        border: none;
        outline: none;
    }

    input {
        padding: 0 15px;
        height: 100%;
        width: 100%;
        border: 1px solid #ddd;
        font-size: 18px;
        box-sizing: border-box;

        &:not(:placeholder-shown) {
            border: 1px solid #03a9f4;
            
            + button {
                opacity: 1;
            }
        }

        &:placeholder-shown {
            
            + button {
                opacity: 0;
            }
        }
    }

    button {
        background: #03a9f4;
        color: #feffd4;
        font-size: 15px;
        cursor: pointer;
        width: 100px;
        height: calc(100% - 20px);
        transition: 0.3s;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    
    &:focus-within {
        transform: translateY(-4px);
        border-color: #bbb;
        box-shadow: 4px 4px 10px 2px #ddd;
    }
}
</style>

<template>
    <main>
        <div>
            <input type="text" placeholder="输入你想查询的内容">
            <button type="button">GO</button>
        </div>
    </main>
</template>

<script>
export default {}
</script>
