<template>
  <v-app>
    <div id="app" >
      <v-dialog v-model="displayKO" persistent width="500">
        <v-card>
          <v-card-title class="headline" primary-title>
            Oups...
          </v-card-title>
          <v-card-text>
            <div>
              Malheureusement, Ahoy! est actuellement seulement jouable sur grand
              écran, et n'est pas (encore) responsible !
            </div>
            <div>
              Augmentez la taille de votre fenêtre ou revenez jouer depuis un PC !
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <router-view />
      <!--      <pre>{{ game }}</pre>-->
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: function() {
    return {
      displayKO: this.onResize()
    };
  },
  methods :{
    onResize() {
      console.log("route");
      if (window.innerWidth > 1100) {
        this.displayKO = false;
      } else {
        this.displayKO = true;
      }
    }
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
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
