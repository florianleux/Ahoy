<template>
    <div id="map">
        <v-row>
            <div class="canvas">
                <div class="line" v-for="n in 10" :key="n">
                    <div class="square" :data-y="n" :data-x="m" v-for="m in 10" :key="m"></div>
                </div>
            </div>
        </v-row>
    </div>


</template>

<script>
    export default {
        name: "Map"
    };

</script>


<style scoped lang="less">

    @grid-size: 600px;

    .canvas{
        margin:auto;
        width: @grid-size;
        height: @grid-size;
        border: 1px solid red;
    }

    .line{
        height: @grid-size/10;
        width: 100%;
    }

    .square{
        float:right;
        width:10%;
        border: 1px solid red;
        height:100%;
    }


</style>

