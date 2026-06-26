<script setup>
import { ref, computed, watch } from "vue";
import FangModal from "./components/FangModal.vue";
import TagebuchView from "./components/TagebuchView.vue";
import StatsView from "./components/StatsView.vue";

const FISCHARTEN = [
  {
    id: "bachforelle",
    name: "Bachforelle",
    kategorie: "Lachsfische",
    emoji: "🐟",
  },
  {
    id: "regenbogenforelle",
    name: "Regenbogenforelle",
    kategorie: "Lachsfische",
    emoji: "🐟",
  },
  {
    id: "seeforelle",
    name: "Seeforelle",
    kategorie: "Lachsfische",
    emoji: "🐟",
  },
  { id: "aaesche", name: "Äsche", kategorie: "Lachsfische", emoji: "🐟" },
  {
    id: "bachsaibling",
    name: "Bachsaibling",
    kategorie: "Lachsfische",
    emoji: "🐟",
  },
  {
    id: "seesaibling",
    name: "Seesaibling",
    kategorie: "Lachsfische",
    emoji: "🐟",
  },
  {
    id: "renke",
    name: "Renke (Lavarello)",
    kategorie: "Lachsfische",
    emoji: "🐟",
  },
  { id: "huchen", name: "Huchen", kategorie: "Lachsfische", emoji: "🐟" },
  { id: "karpfen", name: "Karpfen", kategorie: "Karpfenfische", emoji: "🐠" },
  { id: "hecht", name: "Hecht", kategorie: "Karpfenfische", emoji: "🐠" },
  { id: "zander", name: "Zander", kategorie: "Karpfenfische", emoji: "🐠" },
  {
    id: "barsch",
    name: "Flussbarsch",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  { id: "schleie", name: "Schleie", kategorie: "Karpfenfische", emoji: "🐠" },
  {
    id: "brachse",
    name: "Brachse (Blei)",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "rotauge",
    name: "Rotauge (Plötze)",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  { id: "rotfeder", name: "Rotfeder", kategorie: "Karpfenfische", emoji: "🐠" },
  { id: "hasel", name: "Hasel", kategorie: "Karpfenfische", emoji: "🐠" },
  {
    id: "doebel",
    name: "Döbel (Aitel)",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  { id: "barbe", name: "Barbe", kategorie: "Karpfenfische", emoji: "🐠" },
  {
    id: "nerfling",
    name: "Nerfling (Aland)",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  { id: "guester", name: "Güster", kategorie: "Karpfenfische", emoji: "🐠" },
  { id: "giebel", name: "Giebel", kategorie: "Karpfenfische", emoji: "🐠" },
  {
    id: "karausche",
    name: "Karausche",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "gruendling",
    name: "Gründling",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  { id: "elritze", name: "Elritze", kategorie: "Karpfenfische", emoji: "🐠" },
  {
    id: "schneider",
    name: "Schneider (Laube)",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  { id: "rapfen", name: "Rapfen", kategorie: "Karpfenfische", emoji: "🐠" },
  {
    id: "schmerle",
    name: "Bachschmerle",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "steinbeisser",
    name: "Steinbeißer",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  { id: "zobel", name: "Zobel", kategorie: "Karpfenfische", emoji: "🐠" },
  { id: "wels", name: "Wels", kategorie: "Welse & Sonstige", emoji: "🐡" },
  { id: "aal", name: "Aal", kategorie: "Welse & Sonstige", emoji: "🐡" },
  {
    id: "stichling",
    name: "Stichling",
    kategorie: "Welse & Sonstige",
    emoji: "🐡",
  },
  { id: "quappe", name: "Quappe", kategorie: "Welse & Sonstige", emoji: "🐡" },
  {
    id: "kaulbarsch",
    name: "Kaulbarsch",
    kategorie: "Welse & Sonstige",
    emoji: "🐡",
  },
];

const KATEGORIEN = ["Alle", ...new Set(FISCHARTEN.map((f) => f.kategorie))];

const STORAGE_KEY = "fischtagebuch_v1";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { faenge: {}, photos: {} };
  } catch {
    return { faenge: {}, photos: {} };
  }
}

function saveData(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
}

const data = ref(loadData());
const activeTab = ref("liste");
const selectedKat = ref("Alle");
const search = ref("");
const modalFisch = ref(null);
const filter = ref("alle");

watch(
  data,
  (value) => {
    saveData(value);
  },
  { deep: true },
);

function handleSaveFang(fang) {
  const fishId = modalFisch.value.id;
  const existing = data.value.faenge[fishId] || [];
  data.value.faenge[fishId] = [...existing, fang];
  modalFisch.value = null;
}

function handleDeleteFang(fischId, fangId) {
  data.value.faenge[fischId] = (data.value.faenge[fischId] || []).filter(
    (f) => f.id !== fangId,
  );
}

const gefangeneArten = computed(() =>
  Object.entries(data.value.faenge)
    .filter(([, faenge]) => faenge.length > 0)
    .map(([id]) => id),
);

const filteredFische = computed(() =>
  FISCHARTEN.filter((f) => {
    const katOk =
      selectedKat.value === "Alle" || f.kategorie === selectedKat.value;
    const searchOk = f.name.toLowerCase().includes(search.value.toLowerCase());
    const gefangen = gefangeneArten.value.includes(f.id);
    const filterOk =
      filter.value === "alle" ||
      (filter.value === "gefangen" && gefangen) ||
      (filter.value === "offen" && !gefangen);

    return katOk && searchOk && filterOk;
  }),
);

function latestFang(fischId) {
  const faenge = data.value.faenge[fischId] || [];
  return faenge.length ? faenge[faenge.length - 1] : null;
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <div class="header-logo">
          <span class="logo-icon">🎣</span>
          <div>
            <h1 class="logo-title">Fischtagebuch</h1>
            <p class="logo-sub">Bayerische Gewässer</p>
          </div>
        </div>

        <div class="header-progress">
          <span class="header-progress-text">
            {{ gefangeneArten.length }}/{{ FISCHARTEN.length }}
          </span>
          <div class="header-progress-bar">
            <div
              class="header-progress-fill"
              :style="{
                width: `${(gefangeneArten.length / FISCHARTEN.length) * 100}%`,
              }"
            />
          </div>
        </div>
      </div>
    </header>

    <nav class="nav">
      <button
        class="nav-btn"
        :class="{ active: activeTab === 'liste' }"
        @click="activeTab = 'liste'"
      >
        <span class="nav-label">Arten</span>
      </button>
      <button
        class="nav-btn"
        :class="{ active: activeTab === 'tagebuch' }"
        @click="activeTab = 'tagebuch'"
      >
        <span class="nav-label">Tagebuch</span>
      </button>
      <button
        class="nav-btn"
        :class="{ active: activeTab === 'stats' }"
        @click="activeTab = 'stats'"
      >
        <span class="nav-label">Statistik</span>
      </button>
    </nav>

    <main class="main">
      <template v-if="activeTab === 'liste'">
        <div class="filter-bar">
          <input
            v-model="search"
            class="search-input"
            placeholder="Fischart suchen…"
          />

          <div class="pill-group">
            <button
              v-for="f in ['alle', 'offen', 'gefangen']"
              :key="f"
              class="pill"
              :class="{ active: filter === f }"
              @click="filter = f"
            >
              {{
                f === "alle"
                  ? "Alle"
                  : f === "offen"
                    ? "Noch nicht"
                    : "Gefangen"
              }}
            </button>
          </div>

          <div class="pill-group">
            <button
              v-for="k in KATEGORIEN"
              :key="k"
              class="pill"
              :class="{ active: selectedKat === k }"
              @click="selectedKat = k"
            >
              {{ k }}
            </button>
          </div>
        </div>

        <div class="fisch-grid">
          <button
            v-for="fisch in filteredFische"
            :key="fisch.id"
            class="fisch-card"
            :class="{ done: (data.faenge[fisch.id] || []).length > 0 }"
            @click="modalFisch = fisch"
          >
            <img
              v-if="latestFang(fisch.id)?.foto"
              :src="latestFang(fisch.id).foto"
              :alt="fisch.name"
              class="fisch-card-foto"
            />

            <div class="fisch-card-body">
              <div class="fisch-card-top">
                <span class="fisch-kat">{{ fisch.kategorie }}</span>
                <span
                  v-if="(data.faenge[fisch.id] || []).length > 0"
                  class="check-badge"
                >
                  ✓
                </span>
              </div>

              <p class="fisch-name">{{ fisch.name }}</p>

              <p
                v-if="(data.faenge[fisch.id] || []).length > 0"
                class="fisch-count"
              >
                {{ (data.faenge[fisch.id] || []).length }}× gefangen
              </p>
              <p v-else class="fisch-empty">Noch nicht gefangen</p>

              <p v-if="latestFang(fisch.id)?.gewicht" class="fisch-best">
                Bester: {{ latestFang(fisch.id).gewicht }} kg
              </p>
            </div>

            <div class="fisch-card-add">+</div>
          </button>

          <div v-if="filteredFische.length === 0" class="empty-state">
            <p class="empty-title">Keine Ergebnisse</p>
            <p class="empty-text">Versuche andere Suchbegriffe oder Filter.</p>
          </div>
        </div>
      </template>

      <TagebuchView
        v-else-if="activeTab === 'tagebuch'"
        :data="data"
        :fischarten="FISCHARTEN"
        @delete-fang="handleDeleteFang"
      />

      <StatsView
        v-else-if="activeTab === 'stats'"
        :data="data"
        :fischarten="FISCHARTEN"
      />
    </main>

    <FangModal
      v-if="modalFisch"
      :fisch="modalFisch"
      :existing-faenge="data.faenge[modalFisch.id] || []"
      @close="modalFisch = null"
      @save="handleSaveFang"
    />
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: #f4f8fa;
}

.app {
  width: 100%;
  min-height: 100vh;
  background: #f4f8fa;
  color: #1a3d52;
}

.header {
  background: #1a5470;
  color: #fff;
  padding: 16px 20px 14px;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 28px;
}

.logo-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.logo-sub {
  margin: 1px 0 0;
  font-size: 11px;
  opacity: 0.65;
}

.header-progress {
  text-align: right;
}

.header-progress-text {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  opacity: 0.8;
}

.header-progress-bar {
  width: 80px;
  height: 5px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.header-progress-fill {
  height: 100%;
  background: #5fd4a8;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.nav {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #ddeaf0;
}

.nav-btn {
  flex: 1;
  padding: 10px 4px 8px;
  border: 0;
  background: transparent;
  color: #8ba8b8;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.nav-btn.active {
  color: #2d7fa6;
  border-bottom-color: #2d7fa6;
}

.nav-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.main {
  padding: 16px 16px 80px;
}

.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ddeaf0;
  background: #fff;
  font-size: 14px;
  color: #1a3d52;
  box-sizing: border-box;
  box-shadow: 0 2px 12px rgba(45, 127, 166, 0.08);
}

.pill-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pill {
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #ddeaf0;
  background: #fff;
  color: #4a6d82;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.pill.active {
  background: #2d7fa6;
  color: #fff;
  border-color: #2d7fa6;
}

.fisch-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fisch-card {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;
  border: 1px solid #ddeaf0;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 2px 12px rgba(45, 127, 166, 0.08);
}

.fisch-card.done {
  border-left: 3px solid #3a9e6e;
  background: #fafffe;
}

.fisch-card-foto {
  width: 64px;
  height: 64px;
  object-fit: cover;
  flex-shrink: 0;
}

.fisch-card-body {
  flex: 1;
  padding: 10px 12px;
}

.fisch-card-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

.fisch-kat {
  font-size: 10px;
  color: #8ba8b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.check-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3a9e6e;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

.fisch-name {
  margin: 0px 0px 2px;
  font-size: 14px;
  font-weight: 600;
  color: rgb(26, 61, 82);
  margin-top: 5px;
  margin-bottom: 5px;
}

.fisch-count {
  margin: 0;
  font-size: 12px;
  color: #3a9e6e;
  font-weight: 500;
}

.fisch-empty {
  margin: 0;
  font-size: 12px;
  color: #8ba8b8;
}

.fisch-best {
  margin: 2px 0 0;
  font-size: 11px;
  color: #4a6d82;
}

.fisch-card-add {
  padding: 14px;
  color: #2d7fa6;
  opacity: 0.6;
  font-size: 20px;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
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
</style>
