import { create } from "zustand";

type GridPokemon = {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
};

type PokedexState = {
  items: GridPokemon[];
  loading: boolean;
  error: string | null;

  limit: number;
  nextOffset: number;
  hasMore: boolean;

  // ✅ search state
  query: string;
  setQuery: (q: string) => void;

  fetchNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
};

function idFromUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

async function fetchGridDetails(
  id: number,
): Promise<Pick<GridPokemon, "sprite" | "types">> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`Details HTTP ${res.status}`);
  const data = await res.json();

  return {
    sprite:
      data?.sprites?.other?.["official-artwork"]?.front_default ??
      data?.sprites?.front_default ??
      null,
    types: (data?.types ?? []).map((t: any) => t.type.name),
  };
}

export const usePokedexStore = create<PokedexState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  limit: 24,
  nextOffset: 0,
  hasMore: true,

  // ✅ search state
  query: "",
  setQuery: (q) => set({ query: q }),

  refresh: async () => {
    set({
      items: [],
      error: null,
      loading: false,
      nextOffset: 0,
      hasMore: true,
      query: "", // optional, but usually nice UX
    });
    await get().fetchNextPage();
  },

  fetchNextPage: async () => {
    const { loading, hasMore, nextOffset, limit, items } = get();
    if (loading || !hasMore) return;

    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${nextOffset}`,
      );
      if (!res.ok) throw new Error(`List HTTP ${res.status}`);

      const json: {
        next: string | null;
        results: { name: string; url: string }[];
      } = await res.json();

      const pageBasics = json.results.map((r) => ({
        id: idFromUrl(r.url),
        name: r.name,
      }));

      // prefill items quickly
      const seen = new Set(items.map((p) => p.id));
      const mergedBasics: GridPokemon[] = [
        ...items,
        ...pageBasics
          .filter((p) => !seen.has(p.id))
          .map((p) => ({ ...p, sprite: null, types: [] })),
      ];
      set({ items: mergedBasics });

      // fetch details for this page in parallel
      const details = await Promise.all(
        pageBasics.map(async (p) => ({
          id: p.id,
          ...(await fetchGridDetails(p.id)),
        })),
      );

      // merge details back into items
      const detailsById = new Map(details.map((d) => [d.id, d]));
      set((state) => ({
        items: state.items.map((p) => {
          const d = detailsById.get(p.id);
          return d ? { ...p, sprite: d.sprite, types: d.types } : p;
        }),
        nextOffset: nextOffset + limit,
        hasMore: json.next !== null,
        loading: false,
      }));
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? "Failed to load Pokémon" });
    }
  },
}));
