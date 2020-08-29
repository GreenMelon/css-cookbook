<style lang="less" scoped>
.box {
    width: 200px;
    padding: 1em;
    border: 1px solid black;
    line-height: 1.5;
    input {
        display: none;
    }
    p {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        margin: 0;
    }
    label {
        padding: 0.2em 0.6em;
        border: 1px solid #009ce2;
        font-size: 0.8em;
        border-radius: 4px;
        color: #fff;
        background-color: #00acff;
        cursor: pointer;
    }
    input:checked + p {
        -webkit-line-clamp: unset;
    }
    input:checked ~ label {
        display: none;
    }
}
</style>

<template>
    <main>
        <div class="box">
            <input
                id="expanded"
                type="checkbox"
            >
            <p>Hey, don't cut me off like that. I want to speak my mind and don't appreciate being put into a box.</p>
            <label
                for="expanded"
                role="button"
            >
                read more
            </label>
        </div>
    </main>
</template>

<script>
export default {}
</script>
