import { Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

const MOCK_DETAILS: Record<string, any> = {
  "1": {
    id: 1,
    name: "Bulbasaur",
    bg: "#46C09B",
    types: ["Grass", "Poison"],
    stats: [
      { name: "HP", value: 45 },
      { name: "Attack", value: 49 },
      { name: "Defense", value: 49 },
      { name: "Sp. Atk", value: 65 },
      { name: "Sp. Def", value: 65 },
      { name: "Speed", value: 45 },
    ],
  },
  "4": {
    id: 4,
    name: "Charmander",
    bg: "#FF6B6B",
    types: ["Fire"],
    stats: [
      { name: "HP", value: 39 },
      { name: "Attack", value: 52 },
      { name: "Defense", value: 43 },
      { name: "Sp. Atk", value: 60 },
      { name: "Sp. Def", value: 50 },
      { name: "Speed", value: 65 },
    ],
  },
};

export default function PokemonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const pokemon = (id && MOCK_DETAILS[id]) || null;

  if (!pokemon) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-5">
        <Text className="text-base text-slate-900">
          Pokemon not found: {id}
        </Text>

        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-600 font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: pokemon.bg }}>
      <SafeAreaView className="flex-1">
        {/* Top bar */}
        <View className="px-4 pb-3 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="p-2">
            <Text className="text-white text-2xl">←</Text>
          </Pressable>

          <Text className="text-white font-extrabold">
            #{String(pokemon.id).padStart(3, "0")}
          </Text>
        </View>

        {/* Title + Types */}
        <View className="px-4">
          <Text className="text-white text-4xl font-black">{pokemon.name}</Text>

          <View className="flex-row gap-2 mt-3 flex-wrap">
            {pokemon.types.map((t: string) => (
              <View key={t} className="px-3 py-1 rounded-full bg-white/25">
                <Text className="text-white text-xs font-bold">{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* White sheet */}
        <View className="flex-1 mt-6 bg-white rounded-t-[28px]">
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-lg font-extrabold text-slate-900 mb-4">
              Base Stats
            </Text>

            {pokemon.stats.map((s: any) => (
              <StatRow key={s.name} name={s.name} value={s.value} />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function StatRow({ name, value }: { name: string; value: number }) {
  const pct = Math.min(100, Math.round((value / 255) * 100));

  return (
    <View className="mb-3">
      <View className="flex-row justify-between">
        <Text className="text-xs font-bold text-slate-500">
          {name.toUpperCase()}
        </Text>
        <Text className="text-xs font-extrabold text-slate-900">{value}</Text>
      </View>

      <View className="h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
        <View
          className="h-2 bg-slate-900 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}
