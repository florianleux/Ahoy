<template>
  <v-app>
    <div id="app">
      <router-view />
      <!--      <pre>{{ game }}</pre>-->
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
@baseFontSize: 19px;

//Fonts Déclaration
@font-face {
  font-family: "Roman Antique";
  src: url("assets/fonts/RomanAntique-Italic.ttf") format("truetype");
}

@font-face {
  font-family: "Space Comics";
  src: url("assets/fonts/SpaceComics.ttf") format("truetype");
}

* {
  font-family: "Roman Antique";
  font-size: @baseFontSize;
}

h1,
.v-btn {
  text-align: center;
  font-family: "Space Comics";
  text-transform: uppercase;
  * {
    font-family: "Space Comics";
    text-transform: uppercase;
  }
}

.v-btn {
  padding: 10px 15px;
  * {
    font-size: 12px;
  }
}

h1 {
  margin: 10px auto;
}

.v-application--wrap {
  padding: 15px 30px;
}
</style>
