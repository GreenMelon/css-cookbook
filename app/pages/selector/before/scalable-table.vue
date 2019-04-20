<style lang="less" scoped>
table {
    margin: 0 auto;
    width: 80%;
    padding: 0;
    border: 1px solid #ccc;
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center;
}

caption {
    font-weight: bolder;
}

tr {
    padding: 5px;
    border: 1px solid #ddd;
}

th {
    padding: 10px;
    text-transform: uppercase;
}

td {
    padding: 10px;
    text-transform: capitalize;
}

/* 媒体查询设备的宽度进行自适应 */
@media screen and (max-width: 800px) {
    table {
        border: 0;
    }

    thead {
        display: none;
    }

    tr {
        margin-bottom: 10px;
        display: block;
        border-bottom: 2px solid #ddd;
    }

    td {
        display: block;
        border-bottom: 1px dotted #ccc;
        font-size: 13px;
        text-align: right;
    }

    td:last-child {
        border-bottom: none;
    }

    td::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        text-transform: uppercase;
    }	  	
}
</style>

<template>
    <main>
        <table>
            <caption>@media screen and (max-width: 500px)</caption>
            <thead>
                <tr>
                    <th>city</th>
                    <th>name</th>
                    <th>player</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(team, index) in teams"
                    :key="index"
                >
                    <td data-label="city">{{ team.city }}</td>
                    <td data-label="name">{{ team.name }}</td>
                    <td data-label="player">{{ team.player }}</td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                teams: [
                    {
                        city: 'los angeles',
                        name: 'lakers',
                        player: 'kobe',
                    },{
                        city: 'golden state',
                        name: 'warriors',
                        player: 'curry',
                    },{
                        city: 'san antonio',
                        name: 'spurs',
                        player: 'duncan',
                    }
                ],
            }
        },
    };
</script>
