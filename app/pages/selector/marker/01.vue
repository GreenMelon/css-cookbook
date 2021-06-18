<style lang="less" scoped>
li {
    color: #000;
    transition: .2s all;
}
li:hover {
    color: #ff6000;
}
li::marker {
    content: '😩';
}
li:hover::marker {
    content: '😁';
}

main {
    counter-reset: h3;
}

h3 {
    display: list-item;
    counter-increment: h3;
}

h3::marker {
    // display: list-item;
    content: "✔" counter(h3) " ";
    font-weight: bold;
    color: lightsalmon;
}
</style>

<template>
    <main>
        <ul>
            <li>Header</li>
            <li>Aside</li>
            <li>Footer</li>
        </ul>

        <div>
            <h3>title</h3>
            <p>paragraph</p>
            <h3>title</h3>
            <p>paragraph</p>
            <h3>title</h3>
            <p>paragraph</p>
        </div>
    </main>
</template>

<script>
export default {}
</script>
