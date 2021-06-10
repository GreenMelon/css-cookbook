<style lang="less" scoped>
.container {
    display: flex;
}

label {
    display: flex;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
}
label input {
    margin-right: 4px;
}

img.scale {
    width: 300px;
}
</style>

<template>
    <main>
        <div class="container">
            <label
                v-for="option in options"
                :key="option"
                :for="option"
            >
                <input
                    v-model="curOption"
                    :value="option"
                    :id="option"
                    type="radio"
                    name="image"
                >
                {{ option }}
            </label>
        </div>

        <br>
        <br>
        <br>

        <div>
            <span>origin:</span><br>
            <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACdJREFUCB1j9Pf3/88ABMmMjCCKgQlMIhGMu3btAquY9mMDWBhDBQAutwfDrUlKzQAAAABJRU5ErkJggg=="
            />
        </div>

        <div>
            <span>scale:</span><br>
            <img
                :style="{
                    imageRendering: curOption,
                }"
                class="scale"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACdJREFUCB1j9Pf3/88ABMmMjCCKgQlMIhGMu3btAquY9mMDWBhDBQAutwfDrUlKzQAAAABJRU5ErkJggg=="
            />
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            options: [
                'auto',
                'crisp-edges',
                'pixelated',
            ],
            curOption: 'auto',
        };
    },
};
</script>
