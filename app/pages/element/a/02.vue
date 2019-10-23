<style lang="less" scoped>
h1 {
    text-align: center;
}
p {
    font-size: 100px;
}

.footnote:target {
    animation: flash 4s;
}
.footnotes :target {
    animation: highlight 4s;
}
@keyframes highlight {
    from {
        background: yellow;
    }
    to {
        background: transparent;
    }
}
@keyframes flash {
    from {
        outline: 10px solid yellow;
    }
    to {
        outline: 10px solid transparent;
    }
}
</style>

<style lang="css">
html {
    scroll-behavior: smooth;    
}
</style>

<template>
    <main id="main">
        <h1>My Article with Footnotes</h1>
        <p>
            Lorem ipsum<sup class="footnote" id="footnote-top-1"><a href="#footnote-bottom-1">1</a></sup>, dolor sit amet consectetur adipisicing elit. Doloribus molestias sint quod harum culpa officia odio itaque? Necessitatibus vitae, nesciunt incidunt molestias nam debitis aut esse exercitationem minus expedita voluptate?
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus molestias sint quod harum culpa officia odio itaque? Necessitatibus vitae, nesciunt incidunt molestias nam debitis aut esse exercitationem minus expedita voluptate?
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus molestias sint quod harum culpa officia odio itaque? Necessitatibus vitae, nesciunt incidunt molestias nam debitis aut esse exercitationem minus expedita voluptate?
        </p>
        <div id="footnotes" class="footnotes">
            <ol>
                <li id="footnote-bottom-1">Lorem ipsum is Greek.
                    <a href="#footnote-top-1">
                        <span class="screen-reader-text">Back to reference</span>
                        ↥
                    </a>
                </li>
            </ol>
        </div>
    </main>
</template>

<script>
export default {}
</script>
