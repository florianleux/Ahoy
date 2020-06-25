<template>
<div>
    <div class="page-title">
        Phase de placement
    </div>
    <Map></Map>
    <Fleet></Fleet>
</div>


</template>

<script>
import Map from '@/components/Placement/Map.vue'
import Fleet from '@/components/Placement/Fleet.vue'

export default {
  name: "Placement",
  components: {
      Map,
      Fleet
  },
  props: ['game'],
    data: function(){
      return{
          player : this.game.player
      }
    }
};

</script>

