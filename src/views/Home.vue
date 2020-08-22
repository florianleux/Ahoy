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
  },
  methods: {},
  beforeCreate: function() {
    document.body.className = "home";
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
}
</style>
