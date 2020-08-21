<template>
  <v-row class="enemy-details">
    <v-col cols="7">
      <div class="infos">
        <v-row class="name-zone">
          <v-col class="label">Nom </v-col>
          <v-col class="value">{{ selectedEnemy.name }}</v-col>
        </v-row>
        <v-row class="mojo-zone">
          <v-col class="label">Mojo </v-col>
          <v-col class="value">"{{ selectedEnemy.phrase }}"</v-col>
        </v-row>
        <v-row class="nature-zone">
          <v-col class="label">Signe particulier </v-col>
          <v-col class="value">{{ selectedEnemy.nature }}</v-col>
        </v-row>
        <v-row class="fleet">
          <v-col class="label">Flotte </v-col>
          <v-col class="value">
            <div
                    v-for="(boat, index) in selectedEnemy.fleet.boats"
                    :key="index"
                    class="boat"
            >
              <span v-for="n in boat.size" :key="n">X</span>
            </div>
          </v-col>
        </v-row>
        <div class="powers-zone">
          <div v-for="(power,index) in selectedEnemy.powers"
          :key="index">
            <v-row
            ><v-col class="label">Pouvoir {{power.type}}</v-col>
              <v-col class="value">{{
                power.name
                }}</v-col></v-row
            >
            <v-row class="description"
                   v-html=" power.description"></v-row
            >
          </div>
        </div>
      </div>

    </v-col>
    <v-col cols="5">
      <img
        rel="preload"
        :src="
          publicPath +
            'players/' +
            selectedEnemy.name.replace(/\s+/g, '') +
            '/' +
            'wanted.png'
        "
        alt=""
        class="wanted"
        height="470px"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "CurrentEnemy",
  data: function() {
    return {
      game: this.$game,
      publicPath: process.env.BASE_URL,
      selectedEnemy: this.$game.enemyList[this.$game.level]
    };
  }
};
</script>

<style scoped lang="less">
.label {
  font-family: "Space Comics";
  text-align: right;
  text-transform: uppercase;
  font-size: 11px;
  line-height: 1;
}
.value {
  text-align: left;
  line-height: 10px;
}

.wanted{
  display: block;
}

.description {
  text-align: center;
  span {
    display: block;
    margin: auto;
  }
}

.powers-zone {
  margin-top: 50px;
  .description{
    text-align: center;
    display: block;
  }
}

.fleet .value {
  line-height: 20px;
  margin-top: -4px;
}

.enemy-details {

  .infos {
    padding-top: 35px;
  }

  .infos{
    float:right;
    min-width: 650px;
    *{
      white-space: nowrap;
    }
  }
}
</style>
