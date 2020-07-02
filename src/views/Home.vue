<template>
  <div class="home">
    <Start />
    <v-dialog v-model="displayKO" persistent width="500">
      <v-card>
        <v-card-title class="headline" primary-title>
          Oups...
        </v-card-title>
        <v-card-text>
          <div>Malheureusement, Ahoy! est actuellement seulement jouable sur grand écran, et n'est pas (encore) responsible !</div>
          <div>Augmentez la taille de votre fenêtre ou revenez jouer depuis un PC !</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import Start from "@/components/Start.vue";

export default {
  name: "Home",
  components: {
    Start
  },
  data: function(){
    return{
      displayKO : this.onResize(),
    }
  },
  methods: {
    onResize() {
      if (window.innerWidth > 1100) {
        this.displayKO = false;
      } else {
        this.displayKO = true;
      }
    }
  },
  created() {
    window.addEventListener('resize', this.onResize)
  },
};
</script>
