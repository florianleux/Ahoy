<template>
  <div id="fleet">
    <!--    <p>Votre flotte</p>-->
    <v-row class="boats">
      <div
        v-for="(boat, index) in fleet.boats"
        :key="index"
        class="boat"
        :class="{ selected: boat.selected, disabled: boat.disabled }"
        @click="selectBoat(boat)"
      >
        <div class="name">Bateau n°{{ index + 1 }}</div>
        <div class="size">
          <span v-for="n in boat.size" :key="n">X</span>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
import $ from "jquery";
import _ from "lodash";
export default {
  name: "Fleet",
  data: function() {
    return {
      fleet: this.$game.player.fleet
    };
  },
  methods: {
    selectBoat: function(boat) {
      if (!boat.placed) {
        this.$game.player.fleet.selectBoat(boat);
      }
    },
    onResize() {
      var target = { x: 1370, y: 85, width: 275, height: 817, paddingTop: 100 };
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
        yOffset = (windowHeight - 1080 * scale) / 2;
      } else {
        // The image fits perfectly in y axis, stretched in x
        scale = yScale;
        xOffset = (windowWidth - 1920 * scale) / 2;
      }

      $("#fleet").css("top", target.y * scale + yOffset);
      $("#fleet").css("left", target.x * scale + xOffset);
      $("#fleet").css("width", target.width * scale);
      $("#fleet").css("height", target.height * scale);
      $("#fleet").css("padding-top", target.paddingTop * scale);
      $(".boats").css("height", (target.height - target.paddingTop) * scale);
      $(".boat").css(
        "height",
        ((target.height - target.paddingTop) * scale) / 5
      );
      $(".boat").css("width", target.width * scale);
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.dispatchEvent(new Event("resize"));
  },
  beforeCreate: function() {
    this.$game.player.fleet.selectBoat(
      _.find(this.$game.player.fleet.boats, ["selected", false])
    );
  }
};
</script>

<style scoped lang="less">
#fleet {
  text-align: center;
  transform: rotate(7deg);
  position: absolute;
}
.boats {
  margin: 0;
}
.boat {
  color: #450000;
  position: relative;

  .name {
    position: absolute;
    top: 25%;
    right: 15%;
  }

  .size {
    position: absolute;
    top: 50%;
    right: 15%;
  }

  &.selected {
    .name,
    .size {
      color: #ffffff;
      text-decoration: underline;
      -webkit-animation: glow 1s ease-in-out infinite alternate;
      -moz-animation: glow 1s ease-in-out infinite alternate;
      animation: glow 1s ease-in-out infinite alternate;
    }
  }
  &:hover {
    cursor: pointer;
  }
  &:not(.selected):hover {
    .name,
    .size {
      color: black;
    }
  }

  &.disabled {
    color: grey;

    &:hover {
      background: initial;
      cursor: not-allowed;
    }
  }
}

@-webkit-keyframes glow {
  from {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073,
      0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
  }
  to {
    text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6,
      0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
  }
}
</style>
