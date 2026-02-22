type PokemonListItem = {
  id: number;
  name: string;
};

export type PokedexState = {
  items: PokemonListItem[];
  loading: boolean;
  error: string | null;

  limit: number;
  nextOffset: number;
  hasMore: boolean;

  query: string;

  fetchNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
  setQuery: (q: string) => void;
};
