import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePokedexStore } from "../../zustand/pokedexStore";
import MyCard from "../../components/my_card";
import MyFilter from "../../components/my_filter";
import MySearch from "../../components/my_search";
import { Image } from "react-native";

const ALL_TYPES = [
  "grass",
  "fire",
  "water",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
  "fighting",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "flying",
  "normal",
];

export default function Index() {
  const { items, loading, error, hasMore, fetchNextPage } = usePokedexStore();

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (items.length === 0) fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const filtered = useMemo(() => {
    let list = items;

    // type filter
    if (selectedTypes.length > 0) {
      const set = new Set(selectedTypes);
      list = list.filter((p) => (p.types ?? []).some((t) => set.has(t)));
    }

    // search filter (name or id)
    const q = query.trim().toLowerCase();
    if (q.length > 0) {
      const digits = q.replace("#", "");
      const idQuery = Number.isFinite(Number(digits)) ? Number(digits) : null;

      list = list.filter((p) => {
        const nameMatch = (p.name ?? "").toLowerCase().includes(q);
        const idMatch = idQuery !== null && p.id === idQuery;
        return nameMatch || idMatch;
      });
    }

    return list;
  }, [items, selectedTypes, query]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-4">
        {/* watermark */}
        <View className="absolute -right-24 -top-24 h-72 w-72 rounded-full overflow-hidden opacity-5">
          <Image
            source={require("../../assets/pokemon_ball_red_n_white.jpg")}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-slate-900">Pokedex</Text>
          <View className="h-11 w-11" />
        </View>

        {/* Search bar (component) */}
        <MySearch
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />

        {/* Error */}
        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
            <Text className="text-red-700 font-semibold">Failed to load</Text>
            <Text className="text-red-700/80 mt-1">{error}</Text>
            <Pressable
              onPress={fetchNextPage}
              className="mt-2 self-start px-3 py-2 rounded-lg bg-red-600"
            >
              <Text className="text-white font-semibold">Try again</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Grid */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 16 }}
          contentContainerStyle={{ gap: 16, paddingBottom: 120 }}
          onEndReachedThreshold={0.6}
          onEndReached={() => {
            // If user is searching/filtering, avoid auto-fetch spam
            if (query.trim().length > 0 || selectedTypes.length > 0) return;
            if (!loading && hasMore) fetchNextPage();
          }}
          ListEmptyComponent={() => {
            if (loading) return null;
            return (
              <View className="py-10 items-center">
                <Text className="text-slate-500">No Pokémon found</Text>
              </View>
            );
          }}
          ListFooterComponent={() => {
            if (loading) {
              return (
                <View className="py-6 items-center">
                  <ActivityIndicator />
                  <Text className="text-slate-500 mt-2">Loading…</Text>
                </View>
              );
            }
            if (!hasMore && items.length > 0) {
              return (
                <View className="py-6 items-center">
                  <Text className="text-slate-500">End of list</Text>
                </View>
              );
            }
            return null;
          }}
          renderItem={({ item }) => (
            <MyCard
              id={item.id}
              name={item.name}
              types={item.types}
              sprite={item.sprite}
            />
          )}
        />

        {/* FAB filter */}
        <Pressable
          onPress={() => setFilterOpen(true)}
          className="absolute right-6 bottom-8 h-14 w-14 rounded-full items-center justify-center shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Image
            source={require("../../assets/pokemon_ball_red_n_white.jpg")}
            className="h-full w-full rounded-full"
            resizeMode="cover"
          />
        </Pressable>

        {/* Filter Component */}
        <MyFilter
          visible={filterOpen}
          selectedTypes={selectedTypes}
          allTypes={ALL_TYPES}
          onToggleType={toggleType}
          onClear={() => setSelectedTypes([])}
          onClose={() => setFilterOpen(false)}
        />
      </View>
    </SafeAreaView>
  );
}
