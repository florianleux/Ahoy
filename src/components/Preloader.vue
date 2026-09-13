<template>
  <!--  Preloading images-->
  <div id="preloader">
    <img v-for="path in paths" :key="path" rel="preload" :src="path" />
  </div>
</template>

<script>
import { assetUrl } from "@/utils/assets";
import { game } from "@/game.js";

// What the first screens need before they are shown. Fixed paths on one side;
// on the other, the ones that depend on which enemy is next, derived from
// enemyList rather than written out -- adding an enemy used to mean remembering
// to come and edit this list too.
const FIXED = [
  "home/bg.webp",
  "home/players/male.webp",
  "home/players/female.webp",
  "placement/bg.webp",
  "fight/bg.webp",
  "placement/shadow.webp",
  "fight/shadow.webp",
  "placement/boats/1.webp",
  "placement/boats/2.webp",
  "placement/boats/3.webp",
  "placement/boats/4.webp",
  "placement/boats/5.webp",
  "placement/map.webp",
  "placement/frame.webp",
  "players/female/default.webp",
  "players/male/default.webp",
  "players/plank.webp"
];

const PER_ENEMY = ["wanted.webp", "default.webp"];

export default {
  name: "Preloader",
  computed: {
    paths() {
      const enemy = game.enemyList[game.level];
      const enemyPaths = enemy
        ? PER_ENEMY.map(file => `players/${enemy.className}/${file}`)
        : [];
      return [...FIXED, ...enemyPaths].map(assetUrl);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@media screen {
  div#preloader {
    position: absolute;
    left: -9999px;
    top: -9999px;
  }
  div#preloader img {
    display: block;
  }
}
@media print {
  div#preloader,
  div#preloader img {
    visibility: hidden;
    display: none;
  }
}
</style>
