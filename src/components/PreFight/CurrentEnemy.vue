<template>
  <v-row class="enemy-details">
    <v-col cols="7">
      <div class="infos">
        <v-row class="name-zone">
          <v-col class="label">{{ $t("nom") }} </v-col>
          <v-col class="value">{{ $t(selectedEnemy.name) }}</v-col>
        </v-row>
        <v-row class="mojo-zone">
          <v-col class="label">{{ $t("mojo") }} </v-col>
          <v-col class="value">"{{ $t(selectedEnemy.phrase) }}"</v-col>
        </v-row>
        <v-row class="nature-zone">
          <v-col class="label">{{ $t("signe_particulier") }} </v-col>
          <v-col class="value">{{ $t(selectedEnemy.nature) }}</v-col>
        </v-row>
        <v-row class="fleet">
          <v-col class="label">{{ $t("flotte") }} </v-col>
          <v-col class="value">
            <div
              v-for="(boat, index) in selectedEnemy.fleet.boats"
              :key="index"
              class="boat"
            >
              <span v-for="n in boat.size" :key="n">
                <img
                  rel="preload"
                  :src="
                    publicPath + 'boats/' + selectedEnemy.className + '/ok.png'
                  "
                  alt=""
                  width="30"
                  class="coin"
                />
              </span>
            </div>
          </v-col>
        </v-row>
        <div class="powers-zone">
          <div>
            <v-row
              ><v-col class="label"
                >{{ $t("pouvoir_" + selectedEnemy.mainPower.type) }}
              </v-col>
              <v-col class="value">{{
                $t(selectedEnemy.mainPower.name)
              }}</v-col></v-row
            >
            <v-row
              class="description"
              v-html="$t(selectedEnemy.mainPower.description)"
            ></v-row>
          </div>
          <div
            v-for="(power, index) in selectedEnemy.secondaryPowers"
            :key="index"
          >
            <v-row
              ><v-col class="label">{{ $t("pouvoir_" + power.type) }}</v-col>
              <v-col class="value">{{ $t(power.name) }}</v-col></v-row
            >
            <v-row class="description" v-html="$t(power.description)"></v-row>
          </div>
        </div>
      </div>
    </v-col>
    <v-col cols="5">
      <img
        rel="preload"
        :src="
          publicPath + 'players/' + selectedEnemy.className + '/' + 'wanted.png'
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

.wanted {
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
  .description {
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
    padding-top: 10px;
  }

  .infos {
    float: right;
    min-width: 650px;
    * {
      white-space: nowrap;
    }
  }
}
</style>
