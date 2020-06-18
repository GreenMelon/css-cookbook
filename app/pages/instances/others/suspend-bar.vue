<style scoped lang="less">

@color-main: #007dd4;
@color-asist: #c7254e;

.nav {
    margin: 50px auto;
    width: 750px;
    font-family: 'MicroSoft YaHei';
    font-size: 0;
    text-align: center;
    color: @color-main;
    background-color: #ccc;
}

.item {
    position: relative;
    display: inline-block;
    width: 150px;
    height: 50px;
    font-size: 16px;
    &:not(:first-child)::before {
        content: '|';
        position: absolute;
        top: 12px;
        left: -10px;
        transform: skew(30deg);
    }
    &.active {
        color: #fff;
        background-color: @color-main;
        &::before,
        &::after {
            content: '';
            position: absolute;
            top: -5px;
            transform: skew(0);
        }
        &::before {
            left: -25px;
            border-top: 55px solid @color-main;
            border-left: 25px solid transparent;
        }
        &::after {
            left: 150px;
            border-right: 25px solid transparent;
            border-bottom: 55px solid @color-main;
        }
        .content {
            top: -5px;
            height: 55px;
            background-color: @color-main;
            &::after {
                content: "";
                position: absolute;
                right: -45px;
                z-index: -1;
                border-right: 45px solid transparent;
                border-bottom: 10px solid darken(@color-main, 10%);
            }
            .link {
                position: absolute;
                top: 5px;
                left: 0;
                display: block;
                width: 100%;
            }
        }
    }
    &:first-child.active::before {
        display: none;
    }
    &:last-child.active {
        &::after,
        .content::after {
            display: none;
        }
    }
}

.content {
    position: absolute;
    display: block;
    width: 100%;
    padding: 0 10px;		
    line-height: 50px;
}

.link {
    color: inherit;
	text-decoration: none;
}
</style>

<template>
    <main>
        <div class="header">
            <ul class="nav">
                <li
                    v-for="(t, i) in teams"
                    :key="i"
                    :class="{ active: team === t }"
                    @click="activeItem(t)"
                    class="item"
                >
                    <span class="content">
                        <a class="link" href="javascript:;">{{ t }}</a>
                    </span>
                </li>
            </ul>
        </div>
    </main>
</template>

<script>
// 悬挂条导航
export default {
    data() {
        return {
            teams: [
                'LAL Lakers',
                'GS Warriors',
                'SAS Spurs',
                'MIA Heats',
                'BOS Celtics',
            ],
            team: '',
        };
    },

    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.team = this.teams[0];
        },
        activeItem(team) {
            this.team = team;
        },
    },
};
</script>
