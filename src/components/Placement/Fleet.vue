<template>
  <div>
    <p>Votre flotte</p>
    <v-row>
      <v-col cols="12" v-for="(boat, index) in fleet.boats" :key="index">
        <div
          class="boat"
          :class="{ selected: boat.selected }"
          @click="selectBoat(boat)"
        >
          <div class="name">Bateau n°{{ index + 1 }}</div>
          <div class="size">
            <span v-for="n in boat.size" :key="n">X</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Fleet",
  data: function() {
    return {
      fleet: this.$game.player.fleet
    };
  },
  methods: {
    selectBoat: function(boat) {
      this.$game.player.fleet.selectBoat(boat);
    }
  }
};
</script>

<style lang="less">
.boat:hover {
  background: grey;
}

.boat.selected {
  background: red;
}
</style>
