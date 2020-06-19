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
                .map(i => {
                    const { alias } = files(i);
                    return {
                        path: i.replace(/(\.\/|\.vue)/g, ''),
                        alias,
                    };
                })
                .filter(i => i.path.startsWith(name) && !i.path.includes('ignore'))
                .map(i => ({
                    alias: i.alias,
                    path: i.path.replace(`${name}/`, '').split('/'),
                }));

            const { categories } = this;

            paths.forEach(i => {
                this.createNode(i, categories);
            });
        },

        createNode(item, nodes) {
            const { path, alias } = item;
            const name = path.shift();
            const idx = nodes.findIndex((i) => i.name === name);
            if (idx < 0) {
                nodes.push({
                    name,
                    alias: path.length === 0 ? alias : '',
                    childrens: [],
                });
                if (path.length !== 0) {
                    this.createNode(item, nodes[nodes.length - 1].childrens);
                }
            } else {
                this.createNode(item, nodes[idx].childrens);
            }
        },
    },
}
</script>
