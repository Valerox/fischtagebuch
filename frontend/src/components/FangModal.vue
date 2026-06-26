<script setup>
import { ref } from "vue";

const props = defineProps({
  fisch: { type: Object, required: true },
  existingFaenge: { type: Array, default: () => [] },
});

const emit = defineEmits(["close", "save"]);

const gewicht = ref("");
const laenge = ref("");
const datum = ref(new Date().toISOString().split("T")[0]);
const notiz = ref("");
const fotoData = ref(null);
const fileRef = ref(null);

function openFileDialog() {
  fileRef.value?.click();
}

function handleFoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    fotoData.value = ev.target?.result ?? null;
  };
  reader.readAsDataURL(file);
}

function handleSave() {
  emit("save", {
    id: Date.now(),
    datum: datum.value,
    gewicht: gewicht.value ? parseFloat(gewicht.value) : null,
    laenge: laenge.value ? parseFloat(laenge.value) : null,
    notiz: notiz.value,
    foto: fotoData.value,
  });
}
</script>

<template>
  <div class="overlay" @click="emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">🎣 {{ props.fisch.name }}</h2>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div class="foto-area" @click="openFileDialog">
          <img v-if="fotoData" :src="fotoData" alt="Fang" class="foto-preview" />
          <div v-else class="foto-placeholder">
            <span class="foto-icon">📷</span>
            <span class="foto-text">Foto hinzufügen</span>
          </div>

          <input
            ref="fileRef"
            type="file"
            accept="image/*"
            capture="environment"
            class="hidden-input"
            @change="handleFoto"
          />
        </div>

        <div class="field-group">
          <label class="label">Datum</label>
          <input v-model="datum" class="input" type="date" />
        </div>

        <div class="field-row">
          <div class="field-group">
            <label class="label">Gewicht (kg)</label>
            <input v-model="gewicht" class="input" type="number" step="0.01" min="0" placeholder="z.B. 2.3" />
          </div>
          <div class="field-group">
            <label class="label">Länge (cm)</label>
            <input v-model="laenge" class="input" type="number" step="0.5" min="0" placeholder="z.B. 45" />
          </div>
        </div>

        <div class="field-group">
          <label class="label">Notiz</label>
          <textarea
            v-model="notiz"
            class="input textarea"
            placeholder="Gewässer, Köder, Wetter…"
          />
        </div>

        <div v-if="props.existingFaenge.length > 0" class="prev-section">
          <p class="prev-title">Bisherige Fänge ({{ props.existingFaenge.length }})</p>
          <div class="prev-list">
            <div
              v-for="f in [...props.existingFaenge].reverse()"
              :key="f.id"
              class="prev-item"
            >
              <img v-if="f.foto" :src="f.foto" alt="" class="prev-thumb" />
              <div>
                <span class="prev-date">
                  {{ new Date(f.datum).toLocaleDateString("de-DE") }}
                </span>
                <span v-if="f.gewicht" class="prev-stat"> · {{ f.gewicht }} kg</span>
                <span v-if="f.laenge" class="prev-stat"> · {{ f.laenge }} cm</span>
                <p v-if="f.notiz" class="prev-notiz">{{ f.notiz }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="emit('close')">Abbrechen</button>
        <button class="save-btn" @click="handleSave">Fang eintragen</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  background: rgba(15, 35, 50, 0.55);
  backdrop-filter: blur(2px);
}

.modal {
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px 20px 0 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #ddeaf0;
}

.modal-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #1a3d52;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: #e8f4f8;
  color: #4a6d82;
  cursor: pointer;
  font-size: 20px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px 20px;
}

.foto-area {
  min-height: 120px;
  margin-bottom: 16px;
  border: 2px dashed #ddeaf0;
  border-radius: 12px;
  overflow: hidden;
  background: #e8f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.foto-preview {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.foto-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #8ba8b8;
  padding: 24px;
}

.foto-icon {
  font-size: 22px;
}

.foto-text {
  font-size: 13px;
}

.hidden-input {
  display: none;
}

.field-row {
  display: flex;
  gap: 10px;
}

.field-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.label {
  font-size: 11px;
  font-weight: 600;
  color: #4a6d82;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #ddeaf0;
  border-radius: 9px;
  background: #f4f8fa;
  color: #1a3d52;
  font-size: 14px;
}

.textarea {
  resize: none;
  height: 70px;
  line-height: 1.5;
}

.prev-section {
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid #ddeaf0;
}

.prev-title {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #4a6d82;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.prev-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prev-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 8px 10px;
  border-radius: 9px;
  background: #e8f4f8;
}

.prev-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.prev-date {
  font-size: 12px;
  font-weight: 600;
  color: #1a3d52;
}

.prev-stat {
  font-size: 12px;
  color: #4a6d82;
}

.prev-notiz {
  margin: 3px 0 0;
  font-size: 12px;
  color: #4a6d82;
  font-style: italic;
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid #ddeaf0;
}

.cancel-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddeaf0;
  border-radius: 10px;
  background: transparent;
  color: #4a6d82;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.save-btn {
  flex: 2;
  padding: 12px;
  border: 0;
  border-radius: 10px;
  background: #2d7fa6;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
</style>