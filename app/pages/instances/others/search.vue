<style lang="css" scoped>
@import url('https://use.fontawesome.com/releases/v5.3.1/css/all.css');

main {
    display: flex;
    justify-content: center;
    align-items: center;
}

.search__box {
    box-sizing: content-box;
    height: 40px;
    padding: 10px 15px 10px 15px;
    border-radius: 40px;
    background: #2f3640;
}

.search__txt {
    float: left;
    width: 0;
    padding: 0;
    border: none;
    font-size: 16px;
    line-height: 40px;
    color: white;
    background: none;
    outline: none;
    transition: 0.2s;
}

.search__box:hover > .search__txt {
    width: 240px;
    padding: 0 6px;
}

.search__box:hover > .search__btn {
    background: white;
}

.search__box:hover > .search__btn i {
    color: #34ace0;
    transition: 0.9s;
}

.search__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
    width: 40px;
    height: 40px;
    text-decoration: none;
    border-radius: 50%;
    color: #e84118;
    background: #34ace0;
}

.search__btn i {
    line-height: 40px;
    color: white;
    transition: 0.9s;
}
</style>

<template>
    <main>
        <div class="search__box">
            <input
                type="text"
                class="search__txt"
                placeholder="Type to search"
            >
            <a
                class="search__btn"
                href="javascript:void(0);"
            >
                <i class="fas fa-search"></i>
            </a>
        </div>
    </main>
</template>

<script>
export default {}
</script>
