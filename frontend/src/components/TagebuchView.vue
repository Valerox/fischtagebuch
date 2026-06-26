<script setup>
import { computed } from "vue";

const props = defineProps({
  data: { type: Object, required: true },
  fischarten: { type: Array, required: true },
});

const emit = defineEmits(["delete-fang"]);

const allFaenge = computed(() => {
  const result = [];

  props.fischarten.forEach((fisch) => {
    const faenge = props.data.faenge[fisch.id] || [];
    faenge.forEach((f) => {
      result.push({
        ...f,
        fischName: fisch.name,
        fischId: fisch.id,
      });
    });
  });

  return result.sort((a, b) => new Date(b.datum) - new Date(a.datum));
});
</script>

<template>
  <div v-if="allFaenge.length === 0" class="empty-state">
    <div class="empty-icon">🎣</div>
    <p class="empty-title">Noch keine Fänge eingetragen</p>
    <p class="empty-text">Wechsle zur Fischliste und trage deinen ersten Fang ein.</p>
  </div>

  <div v-else class="tagebuch-list">
    <div
      v-for="f in allFaenge"
      :key="f.id"
      class="tagebuch-card"
    >
      <img v-if="f.foto" :src="f.foto" :alt="f.fischName" class="tagebuch-foto" />

      <div class="tagebuch-info">
        <div class="tagebuch-row">
          <span class="tagebuch-fischname">{{ f.fischName }}</span>
          <span class="tagebuch-date">
            {{ new Date(f.datum).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) }}
          </span>
        </div>

        <div class="tagebuch-stats">
          <span v-if="f.gewicht" class="stat-pill">{{ f.gewicht }} kg</span>
          <span v-if="f.laenge" class="stat-pill">{{ f.laenge }} cm</span>
        </div>

        <p v-if="f.notiz" class="tagebuch-notiz">{{ f.notiz }}</p>
      </div>

      <button
        class="delete-btn"
        title="Löschen"
        @click="emit('delete-fang', f.fischId, f.id)"
      >
        🗑
      </button>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 48px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #4a6d82;
}

.empty-text {
  margin: 0;
  font-size: 13px;
  color: #8ba8b8;
}

.tagebuch-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tagebuch-card {
  display: flex;
  position: relative;
  overflow: hidden;
  background: #fff;
  border: 1px solid #ddeaf0;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(45, 127, 166, 0.08);
}

.tagebuch-foto {
  width: 80px;
  height: 80px;
  object-fit: cover;
  flex-shrink: 0;
}

.tagebuch-info {
  flex: 1;
  padding: 10px 12px;
}

.tagebuch-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  gap: 8px;
}

.tagebuch-fischname {
  font-size: 14px;
  font-weight: 700;
  color: #1a3d52;
}

.tagebuch-date {
  font-size: 11px;
  color: #8ba8b8;
  white-space: nowrap;
}

.tagebuch-stats {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
}

.stat-pill {
  padding: 2px 8px;
  border-radius: 6px;
  background: #e8f4f8;
  color: #2d7fa6;
  font-size: 11px;
  font-weight: 600;
}

.tagebuch-notiz {
  margin: 0;
  font-size: 12px;
  color: #4a6d82;
  font-style: italic;
}

.delete-btn {
  padding: 12px 14px;
  border: 0;
  background: transparent;
  color: #8ba8b8;
  cursor: pointer;
  flex-shrink: 0;
}
</style>