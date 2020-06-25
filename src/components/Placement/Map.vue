<template>
    <v-row id="map">
        <div class="canvas">
            <div class="line" v-for="n in 10" :key="n">
                <div class="square" :data-y="n" :data-x="m" v-for="m in 10" :key="m" @mouseover="hoverSquare">

                </div>
            </div>
        </div>
    </v-row>
</template>

<script>
    export default {
        name: "MapVue",
        methods: {
            hoverSquare: function (event) {
                this.map.hoverSquare(event);
            }
        },
        data: function () {
            return {
                map: this.$game.player.map
            }
        }
    };

</script>


<style scoped lang="less">

    @grid-size: 600px;

    .canvas {
        margin: auto;
        width: @grid-size;
        height: @grid-size;
        border: 1px solid red;
    }

    .line {
        height: @grid-size/10;
    }

    .square {
        float: right;
        width: 10%;
        border: 1px solid red;
        height: 100%;
    }

</style>

