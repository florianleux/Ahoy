<template>
  <div id="app">
    <router-view />
    <pre>{{ game }}</pre>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function() {
    return {
      game: this.$game
    };
  }
};
</script>
