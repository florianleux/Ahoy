<template>
  <div id="fleet">
    <p>Votre flotte</p>
    <v-row>
      <v-col cols="12" v-for="(boat, index) in fleet.boats" :key="index">
        <div
          class="boat"
          :class="{ selected: boat.selected, disabled: boat.disabled }"
          @click="selectBoat(boat)"
        >
          <div class="name">
            Bateau n°{{ index + 1 }} <span v-if="boat.placed">placé !</span>
          </div>
          <div class="size">
            <span v-for="n in boat.size" :key="n">X</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import $ from "jquery";

export default {
  name: "Fleet",
  data: function() {
    return {
      fleet: this.$game.player.fleet,
    };
  },
  methods: {
    selectBoat: function(boat) {
      if (!boat.placed) {
        this.$game.player.fleet.selectBoat(boat);
      }
    },
    onResize() {
      var target = { x: 1365, y: 85, width: 275,height: 817};
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();

      // Get largest dimension increase
      var xScale = windowWidth / 1920;
      var yScale = windowHeight / 1080;
      var scale;
      var yOffset = 0;
      var xOffset = 0;

      if (xScale > yScale) {
        // The image fits perfectly in x axis, stretched in y
        scale = xScale;
        yOffset = (windowHeight - (1080 * scale)) / 2;
      } else {
        // The image fits perfectly in y axis, stretched in x
        scale = yScale;
        xOffset = (windowWidth - (1920 * scale)) / 2;
      }

      $("#fleet").css('top', (target.y) * scale + yOffset);
      $("#fleet").css('left', (target.x) * scale + xOffset);
      $("#fleet").css('width', (target.width) * scale );
      $("#fleet").css('height', (target.height) * scale);
      $(".boat").css('height', ((target.height) * scale)/6);

    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.dispatchEvent(new Event('resize'));
  }
};
</script>

<style scoped lang="less">
#fleet{
  text-align: center;
  transform: rotate(7deg);
  position: absolute;
  background:red;
}

.boat {
  height:25%;
  &.selected {
    background: red;
  }

  &:hover {
    cursor: pointer;
    background: grey;
  }

  &.disabled {
    color: grey;
    &:hover {
      background: initial;
      cursor: not-allowed;
    }
  }
}

@media (min-width: 1500px) {
  .fleet {
  }
}
</style>
