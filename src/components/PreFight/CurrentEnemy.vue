<template>
  <div class="grid-row enemy-details">
    <div class="grid-col grid-col-7">
      <div class="infos">
        <div class="grid-row name-zone">
          <div class="grid-col label">{{ $t("nom") }}</div>
          <div class="grid-col value">{{ $t(selectedEnemy.name) }}</div>
        </div>
        <div class="grid-row mojo-zone">
          <div class="grid-col label">{{ $t("mojo") }}</div>
          <div class="grid-col value">"{{ $t(selectedEnemy.phrase) }}"</div>
        </div>
        <div class="grid-row nature-zone">
          <div class="grid-col label">{{ $t("signe_particulier") }}</div>
          <div class="grid-col value">{{ $t(selectedEnemy.nature) }}</div>
        </div>
        <div class="grid-row fleet">
          <div class="grid-col label">{{ $t("flotte") }}</div>
          <div class="grid-col value">
            <div
              v-for="(boat, index) in selectedEnemy.fleet.boats"
              :key="index"
              class="boat"
            >
              <span v-for="n in boat.size" :key="n">
                <img
                  rel="preload"
                  :src="assetUrl('boats/' + selectedEnemy.className + '/ok.webp')"
                  alt=""
                  width="30"
                  class="coin"
                />
              </span>
            </div>
          </div>
        </div>
        <div class="powers-zone">
          <div>
            <div class="grid-row">
              <div class="grid-col label">
                {{ $t("pouvoir_" + selectedEnemy.mainPower.type) }}
              </div>
              <div class="grid-col value">
                {{ $t(selectedEnemy.mainPower.name) }}
              </div>
            </div>
            <div
              class="grid-row description"
              v-html="$t(selectedEnemy.mainPower.description)"
            ></div>
          </div>
          <div
            v-for="(power, index) in selectedEnemy.secondaryPowers"
            :key="index"
          >
            <div class="grid-row">
              <div class="grid-col label">
                {{ $t("pouvoir_" + power.type) }}
              </div>
              <div class="grid-col value">{{ $t(power.name) }}</div>
            </div>
            <div
              class="grid-row description"
              v-html="$t(power.description)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-col grid-col-5">
      <img
        rel="preload"
        :src="assetUrl('players/' + selectedEnemy.className + '/wanted.webp')"
        alt=""
        class="wanted"
        height="470px"
      />
    </div>
  </div>
</template>

<script>
import { assetUrl } from "@/utils/assets";
import { game } from "@/game.js";
export default {
  name: "CurrentEnemy",
  methods: { assetUrl },
  data: function() {
    return {
      game,
      selectedEnemy: game.enemyList[game.level]
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
