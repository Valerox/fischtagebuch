<script setup>
import { computed } from "vue";

const props = defineProps({
  data: { type: Object, required: true },
  fischarten: { type: Array, required: true },
});

const totalFaenge = computed(() => Object.values(props.data.faenge).flat().length);

const artengefangen = computed(() =>
  Object.values(props.data.faenge).filter((f) => f.length > 0).length
);

const progress = computed(() =>
  Math.round((artengefangen.value / props.fischarten.length) * 100)
);

const schwerster = computed(() => {
  let result = null;

  props.fischarten.forEach((fisch) => {
    (props.data.faenge[fisch.id] || []).forEach((f) => {
      if (f.gewicht && (!result || f.gewicht > result.gewicht)) {
        result = { ...f, fischName: fisch.name };
      }
    });
  });

  return result;
});

const laengster = computed(() => {
  let result = null;

  props.fischarten.forEach((fisch) => {
    (props.data.faenge[fisch.id] || []).forEach((f) => {
      if (f.laenge && (!result || f.laenge > result.laenge)) {
        result = { ...f, fischName: fisch.name };
      }
    });
  });

  return result;
});

const topArten = computed(() =>
  props.fischarten
    .map((f) => ({
      name: f.name,
      count: (props.data.faenge[f.id] || []).length,
    }))
    .filter((f) => f.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
);

const circumference = 2 * Math.PI * 46;
const strokeOffset = computed(() => circumference * (1 - progress.value / 100));
</script>

<template>
  <div class="stats-container">
    <div class="stats-card">
      <p class="stats-card-label">Artenvielfalt</p>
      <div class="progress-ring-wrap">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="46" fill="none" stroke="#e8f4f8" stroke-width="10" />
          <circle
            cx="55"
            cy="55"
            r="46"
            fill="none"
            stroke="#2d7fa6"
            stroke-width="10"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeOffset"
            stroke-linecap="round"
            class="progress-circle"
          />
          <text x="55" y="52" text-anchor="middle" class="progress-text">{{ progress }}%</text>
          <text x="55" y="68" text-anchor="middle" class="progress-subtext">GEFANGEN</text>
        </svg>
      </div>
      <p class="stats-subtext">{{ artengefangen }} von {{ props.fischarten.length }} Arten</p>
    </div>

    <div class="stats-row">
      <div class="stat-box">
        <span class="stat-num">{{ totalFaenge }}</span>
        <span class="stat-label">Fänge gesamt</span>
      </div>
      <div class="stat-box">
        <span class="stat-num">{{ artengefangen }}</span>
        <span class="stat-label">Arten</span>
      </div>
    </div>

    <div v-if="schwerster || laengster" class="stats-card">
      <p class="stats-card-label">🏆 Rekorde</p>

      <div v-if="schwerster" class="rekord-item">
        <span class="rekord-icon">⚖️</span>
        <div>
          <p class="rekord-wert">{{ schwerster.gewicht }} kg</p>
          <p class="rekord-fisch">
            {{ schwerster.fischName }} · {{ new Date(schwerster.datum).toLocaleDateString("de-DE") }}
          </p>
        </div>
      </div>

      <div v-if="laengster" class="rekord-item">
        <span class="rekord-icon">📏</span>
        <div>
          <p class="rekord-wert">{{ laengster.laenge }} cm</p>
          <p class="rekord-fisch">
            {{ laengster.fischName }} · {{ new Date(laengster.datum).toLocaleDateString("de-DE") }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="topArten.length > 0" class="stats-card">
      <p class="stats-card-label">🎣 Häufigste Fänge</p>

      <div
        v-for="(art, i) in topArten"
        :key="art.name"
        class="top-art-item"
      >
        <span class="top-art-rank">#{{ i + 1 }}</span>
        <span class="top-art-name">{{ art.name }}</span>
        <span class="top-art-count">{{ art.count }}×</span>
        <div class="top-art-bar-wrap">
          <div
            class="top-art-bar"
            :style="{ width: `${(art.count / topArten[0].count) * 100}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stats-card {
  padding: 18px;
  border: 1px solid #ddeaf0;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(45, 127, 166, 0.08);
}

.stats-card-label {
  margin: 0 0 14px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #8ba8b8;
}

.progress-ring-wrap {
  display: flex;
  justify-content: center;
  margin: 0 0 10px;
}

.progress-circle {
  transform: rotate(-90deg);
  transform-origin: 55px 55px;
  transition: stroke-dashoffset 0.8s ease;
}

.progress-text {
  font-size: 22px;
  font-weight: 700;
  fill: #1a3d52;
  font-family: system-ui, sans-serif;
}

.progress-subtext {
  font-size: 9px;
  fill: #6b8fa3;
  font-family: system-ui, sans-serif;
}

.stats-subtext {
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: #4a6d82;
  font-weight: 500;
}

.stats-row {
  display: flex;
  gap: 12px;
}

.stat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  border: 1px solid #ddeaf0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(45, 127, 166, 0.08);
}

.stat-num {
  font-size: 32px;
  line-height: 1;
  font-weight: 800;
  color: #2d7fa6;
}

.stat-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8ba8b8;
}

.rekord-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.rekord-icon {
  font-size: 24px;
}

.rekord-wert {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a3d52;
}

.rekord-fisch {
  margin: 0;
  font-size: 12px;
  color: #4a6d82;
}

.top-art-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.top-art-rank {
  width: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #8ba8b8;
}

.top-art-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #1a3d52;
}

.top-art-count {
  width: 28px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: #2d7fa6;
}

.top-art-bar-wrap {
  width: 60px;
  height: 4px;
  overflow: hidden;
  border-radius: 2px;
  background: #e8f4f8;
}

.top-art-bar {
  height: 100%;
  border-radius: 2px;
  background: #2d7fa6;
  transition: width 0.5s ease;
}
</style>