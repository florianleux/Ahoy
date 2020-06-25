<template>
    <div>
        <div class="page-title">
            Phase de placements
        </div>
        <MapVue></MapVue>
        <Fleet></Fleet>

        <!--<pre>{{$game}}</pre>-->
    </div>
</template>

<script>
    import MapVue from '@/components/Placement/Map.vue'
    import Fleet from '@/components/Placement/Fleet.vue'
    import {Map} from "@/classes/Map.js";

    export default {
        name: "Placement",
        components: {
            MapVue,
            Fleet
        },
        data: function () {
            return {
                player: this.$game.player
            }
        },
        created: function () {
            this.$game.player.map = new Map();
        }

    };

</script>

