<template>
    <main>
        <categories
            :base-route="baseRoute"
            :categories="categories"
        />
    </main>
</template>

<script>
export default {
    data() {
        return {
            dir: '',
            baseRoute: '',
            categories: [],
        }
    },

    mounted() {
        this.baseRoute = `/${this.dir}`;
        this.getTableOfContents(this.dir);
    },

    methods: {
        getTableOfContents(name) {
            const files = require.context('../../pages', true, /\.vue$/);

            const paths = files.keys()
                .map(i => i.replace(/(\.\/|\.vue)/g, ''))
                .filter(i => i.startsWith(name))
                .map(i => i.replace(`${name}/`, ''))
                .filter(i => i !== 'index');

            const { categories } = this;

            paths.map(i => i.split('/')).forEach(g => {
                this.createNode(g, categories);
            });
        },

        createNode(path, nodes) {
            const name = path.shift();
            const idx = nodes.findIndex((i) => i.name === name);
            if (idx < 0) {
                nodes.push({
                    name,
                    childrens: [],
                });
                if (path.length !== 0) {
                    this.createNode(path, nodes[nodes.length - 1].childrens);
                }
            } else {
                this.createNode(path, nodes[idx].childrens);
            }
        },
    },
}
</script>
