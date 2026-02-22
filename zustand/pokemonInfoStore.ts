import { create } from "zustand";

export type DetailsTab = "about" | "stats" | "evolution" | "moves";

export type PokemonDetails = {
  id: number;
  name: string;

  sprite: string | null;
  types: string[];

  heightDm: number; // pokeapi: decimeters
  weightHg: number; // pokeapi: hectograms
  abilities: string[];

  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAtk: number;
    spDef: number;
    speed: number;
    total: number;
  };

  // fill these later
  moves: { name: string }[];
  evolutionChainUrl: string | null;
};

type State = {
  activeId: number | null;
  tab: DetailsTab;

  byId: Record<number, PokemonDetails>;
  loading: boolean;
  error: string | null;

  open: (id: number) => void;
  setTab: (tab: DetailsTab) => void;

  fetchIfNeeded: (id: number) => Promise<void>;
  getActive: () => PokemonDetails | null;
};

function safeNum(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function fetchPokemonDetails(id: number): Promise<PokemonDetails> {
  // 1) pokemon
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`Pokemon HTTP ${res.status}`);
  const p = await res.json();

  const sprite =
    p?.sprites?.other?.["official-artwork"]?.front_default ??
    p?.sprites?.front_default ??
    null;

  const types = (p?.types ?? []).map((t: any) => t.type.name);

  const abilities = (p?.abilities ?? []).map((a: any) => a.ability.name);

  const statsArr: Record<string, number> = {};
  for (const s of p?.stats ?? []) statsArr[s.stat.name] = safeNum(s.base_stat);

  const hp = statsArr["hp"] ?? 0;
  const attack = statsArr["attack"] ?? 0;
  const defense = statsArr["defense"] ?? 0;
  const spAtk = statsArr["special-attack"] ?? 0;
  const spDef = statsArr["special-defense"] ?? 0;
  const speed = statsArr["speed"] ?? 0;
  const total = hp + attack + defense + spAtk + spDef + speed;

  const moves = (p?.moves ?? []).slice(0, 50).map((m: any) => ({
    name: m.move.name,
  }));

  // 2) species (for evolution chain url)
  let evolutionChainUrl: string | null = null;
  if (p?.species?.url) {
    const res2 = await fetch(p.species.url);
    if (res2.ok) {
      const sp = await res2.json();
      evolutionChainUrl = sp?.evolution_chain?.url ?? null;
    }
  }

  return {
    id: safeNum(p.id),
    name: p.name,

    sprite,
    types,

    heightDm: safeNum(p.height),
    weightHg: safeNum(p.weight),
    abilities,

    stats: { hp, attack, defense, spAtk, spDef, speed, total },

    moves,
    evolutionChainUrl,
  };
}

export const usePokemonInfoStore = create<State>((set, get) => ({
  activeId: null,
  tab: "about",

  byId: {},
  loading: false,
  error: null,

  open: (id) =>
    set({
      activeId: id,
      tab: "about", // reset tab when opening new pokemon
      error: null,
    }),

  setTab: (tab) => set({ tab }),

  fetchIfNeeded: async (id) => {
    const cached = get().byId[id];
    if (cached) return;

    if (get().loading) return;
    set({ loading: true, error: null });

    try {
      const details = await fetchPokemonDetails(id);
      set((s) => ({
        byId: { ...s.byId, [id]: details },
        loading: false,
      }));
    } catch (e: any) {
      set({
        loading: false,
        error: e?.message ?? "Failed to load pokemon details",
      });
    }
  },

  getActive: () => {
    const id = get().activeId;
    if (!id) return null;
    return get().byId[id] ?? null;
  },
}));
