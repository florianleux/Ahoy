<template>
<!--  Preloading images-->
  <div id="preloader">
    <img rel="preload"
      :src="publicPath + 'home/bg.jpg'"
    />
    <img rel="preload"
      :src="publicPath + 'home/players/male.png'"
    />
    <img rel="preload"
      :src="publicPath + 'home/players/female.png'"
    />
    <img rel="preload"
      :src="publicPath + 'placement/bg.jpg'"
    />
    <img rel="preload"
      :src="publicPath + 'fight/bg.jpg'"
    />
    <img rel="preload"
      :src="publicPath + 'placement/bg.jpg'"
    />
    <img rel="preload"
      :src="publicPath + 'placement/png.jpg'"
    />
    <img rel="preload"
      :src="publicPath + 'players/SimpleSam/wanted.png'"
    />
    <img rel="preload"
         :src="publicPath + 'placement/boats/1.png'"
    />
    <img rel="preload"
         :src="publicPath + 'placement/boats/2.png'"
    />
    <img rel="preload"
         :src="publicPath + 'placement/boats/3.png'"
    />
    <img rel="preload"
         :src="publicPath + 'placement/boats/4.png'"
    />
    <img rel="preload"
         :src="publicPath + 'placement/boats/5.png'"
    />
    <img rel="preload"
         :src="publicPath + 'placement/map.png'"
    />
    <img rel="preload"
         :src="publicPath + 'placement/frame.png'"
    />
    <img rel="preload"
      :src="publicPath + 'players/female/default.png'"
    />
    <img rel="preload"
      :src="publicPath + 'players/male/default.png'"
    />
    <img rel="preload"
      :src="publicPath + 'players/plank.png'"
    />
    <img rel="preload"
         :src="publicPath + 'players/SimpleSam/default.png'"
    />

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
