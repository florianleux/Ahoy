<template>
  <!--  Preloading images-->
  <div id="preloader">
    <img rel="preload" :src="publicPath + 'home/bg.webp'" />
    <img rel="preload" :src="publicPath + 'home/players/male.webp'" />
    <img rel="preload" :src="publicPath + 'home/players/female.webp'" />
    <img rel="preload" :src="publicPath + 'placement/bg.webp'" />
    <img rel="preload" :src="publicPath + 'fight/bg.webp'" />
    <img rel="preload" :src="publicPath + 'placement/shadow.webp'" />
    <img rel="preload" :src="publicPath + 'fight/shadow.webp'" />
    <img rel="preload" :src="publicPath + 'players/SimpleSam/wanted.webp'" />
    <img rel="preload" :src="publicPath + 'placement/boats/1.webp'" />
    <img rel="preload" :src="publicPath + 'placement/boats/2.webp'" />
    <img rel="preload" :src="publicPath + 'placement/boats/3.webp'" />
    <img rel="preload" :src="publicPath + 'placement/boats/4.webp'" />
    <img rel="preload" :src="publicPath + 'placement/boats/5.webp'" />
    <img rel="preload" :src="publicPath + 'placement/map.webp'" />
    <img rel="preload" :src="publicPath + 'placement/frame.webp'" />
    <img rel="preload" :src="publicPath + 'players/female/default.webp'" />
    <img rel="preload" :src="publicPath + 'players/male/default.webp'" />
    <img rel="preload" :src="publicPath + 'players/plank.webp'" />
    <img rel="preload" :src="publicPath + 'players/SimpleSam/default.webp'" />
  </div>
</template>

<script>
export default {
  name: "Preloader",
  data() {
    return {
      publicPath: process.env.BASE_URL
    };
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
