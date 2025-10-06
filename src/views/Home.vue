<template>
  <div class="home">
    <Start />
  </div>
</template>

<script>
import Start from "@/components/Start.vue";

export default {
  name: "Home",
  components: {
    Start
  }
};
</script>
<style lang="less">
body.home #app {
  background: url("/home/bg.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

  #help {
    display: none;
  }
}
</style>
