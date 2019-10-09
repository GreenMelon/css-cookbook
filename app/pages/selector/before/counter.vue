<style lang="less" scoped>
.languages {
    margin: 20px;
    counter-reset: characters 0;
}

h3 {
    margin-bottom: 20px;
}

input:checked {
    counter-increment: characters;
}

.total {
    padding-left: 20px;
}
.total::after {
    content: counter(characters);
    margin-left: 10px;
    color: #f00;
}

label {
    display: inline-block;
    margin: 0 10px 0 0;
    font-size: 15px;
}
input[type=checkbox] {
    position: absolute;
    left: -10000px;
}
input[type=checkbox] + label:before {
    content: "";
    display: inline-block;
    margin: 0 5px 0 0;
    width: 18px;
    height: 18px;
    font-size: 15px;
    line-height: 16px;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #000;
    color: transparent;
    cursor: pointer;
    transition: color ease .4s;
}

input[type=checkbox]:checked + label:before {
    content: "\2713";
    color: #000;
}
</style>

<template>
    <main>
        <div class="languages">
            <h3>Select your favorite languages:</h3>
            <input id="c" type="checkbox"><label for="c">C</label>
            <input id="C++" type="checkbox"><label for="C++">C++</label>
            <input id="C#" type="checkbox"><label for="C#">C#</label>
            <input id="Java" type="checkbox"><label for="Java">Java</label>
            <input id="JavaScript" type="checkbox"><label for="JavaScript">JavaScript</label>
            <input id="PHP" type="checkbox"><label for="PHP">PHP</label>
            <input id="Python" type="checkbox"><label for="Python">Python</label>
            <input id="Ruby" type="checkbox"><label for="Ruby">Ruby</label>
        </div>
        <p class="total">Total selected:</p>
    </main>
</template>

<script>
    export default {};
</script>
