import { ref, watch } from "vue";

export const FISCHARTEN = [
  // Lachsfische
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
  {
    id: "aaesche",
    name: "Äsche",
    kategorie: "Lachsfische",
    emoji: "🐟",
  },
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
  {
    id: "huchen",
    name: "Huchen",
    kategorie: "Lachsfische",
    emoji: "🐟",
  },

  // Karpfenfische
  {
    id: "karpfen",
    name: "Karpfen",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "hecht",
    name: "Hecht",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "zander",
    name: "Zander",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "barsch",
    name: "Flussbarsch",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "schleie",
    name: "Schleie",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
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
  {
    id: "rotfeder",
    name: "Rotfeder",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "hasel",
    name: "Hasel",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "doebel",
    name: "Döbel (Aitel)",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "barbe",
    name: "Barbe",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "nerfling",
    name: "Nerfling (Aland)",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "guester",
    name: "Güster",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "giebel",
    name: "Giebel",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
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
  {
    id: "elritze",
    name: "Elritze",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "schneider",
    name: "Schneider (Laube)",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
  {
    id: "rapfen",
    name: "Rapfen",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },
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
  {
    id: "zobel",
    name: "Zobel",
    kategorie: "Karpfenfische",
    emoji: "🐠",
  },

  // Welse & Sonstige
  {
    id: "wels",
    name: "Wels",
    kategorie: "Welse & Sonstige",
    emoji: "🐡",
  },
  {
    id: "aal",
    name: "Aal",
    kategorie: "Welse & Sonstige",
    emoji: "🐡",
  },
  {
    id: "stichling",
    name: "Stichling",
    kategorie: "Welse & Sonstige",
    emoji: "🐡",
  },
  {
    id: "quappe",
    name: "Quappe",
    kategorie: "Welse & Sonstige",
    emoji: "🐡",
  },
  {
    id: "kaulbarsch",
    name: "Kaulbarsch",
    kategorie: "Welse & Sonstige",
    emoji: "🐡",
  },
];

export const KATEGORIEN = [
  "Alle",
  ...new Set(FISCHARTEN.map(f => f.kategorie)),
];

export const STORAGE_KEY = "fischtagebuch_v1";

const DEFAULT_DATA = {
  faenge: {},
  photos: {},
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return structuredClone(DEFAULT_DATA);
    }

    const parsed = JSON.parse(raw);

    return {
      faenge: parsed.faenge ?? {},
      photos: parsed.photos ?? {},
    };
  } catch (err) {
    console.error("Fehler beim Laden des LocalStorage:", err);

    return structuredClone(DEFAULT_DATA);
  }
}

export function useStorage() {
  const data = ref(loadData());

  watch(
    data,
    (value) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(value)
        );
      } catch (err) {
        console.error("Fehler beim Speichern:", err);
      }
    },
    {
      deep: true,
    }
  );

  function addFang(fischId: any, fang: any) {
    if (!data.value.faenge[fischId]) {
      data.value.faenge[fischId] = [];
    }

    data.value.faenge[fischId].push(fang);
  }

  function deleteFang(fischId: any, fangId: any) {
    if (!data.value.faenge[fischId]) return;

    data.value.faenge[fischId] =
      data.value.faenge[fischId].filter(
        (fang: any) => fang.id !== fangId
      );
  }

  function clearAll() {
    data.value = structuredClone(DEFAULT_DATA);
  }

  return {
    data,
    addFang,
    deleteFang,
    clearAll,
  };
}