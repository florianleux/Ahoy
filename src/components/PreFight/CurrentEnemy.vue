<template>
  <div class="grid-row enemy-details">
    <div class="grid-col grid-col-7">
      <div class="infos">
        <div class="grid-row name-zone">
          <div class="grid-col label">{{ $t("nom") }}</div>
          <div class="grid-col value">{{ $t(enemy.name) }}</div>
        </div>
        <div class="grid-row mojo-zone">
          <div class="grid-col label">{{ $t("mojo") }}</div>
          <div class="grid-col value">"{{ $t(enemy.phrase) }}"</div>
        </div>
        <div class="grid-row nature-zone">
          <div class="grid-col label">{{ $t("signe_particulier") }}</div>
          <div class="grid-col value">{{ $t(enemy.nature) }}</div>
        </div>
        <div class="grid-row fleet">
          <div class="grid-col label">{{ $t("flotte") }}</div>
          <div class="grid-col value">
            <div
              v-for="(boat, index) in enemy.fleet.boats"
              :key="index"
              class="boat"
            >
              <span v-for="n in boat.size" :key="n">
                <img
                  rel="preload"
                  :src="assetUrl('boats/' + enemy.className + '/ok.webp')"
                  alt=""
                  width="30"
                  class="coin"
                />
              </span>
            </div>
          </div>
        </div>
        <div class="powers-zone">
          <!-- Every enemy is built with one, but the type says it can be absent. -->
          <div v-if="enemy.mainPower">
            <div class="grid-row">
              <div class="grid-col label">
                {{ $t("pouvoir_" + enemy.mainPower.type) }}
              </div>
              <div class="grid-col value">
                {{ $t(enemy.mainPower.name) }}
              </div>
            </div>
            <div
              class="grid-row description"
              v-html="$t(enemy.mainPower.description)"
            ></div>
          </div>
          <div
            v-for="(power, index) in enemy.secondaryPowers"
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
        :src="assetUrl('players/' + enemy.className + '/wanted.webp')"
        alt=""
        class="wanted"
        height="470px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { assetUrl } from "@/utils/assets";
import { game } from "@/game";

// Derived rather than captured: it re-reads on every level change, unlike the
// data() copy it replaces, which froze the enemy at creation.
const enemy = computed(() => game.enemyList[game.level]);
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
