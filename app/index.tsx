import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_POKEMON = [
  { id: 1, name: "Bulbasaur", type: "Grass", color: "bg-emerald-400" },
  { id: 4, name: "Charmander", type: "Fire", color: "bg-red-400" },
  { id: 7, name: "Squirtle", type: "Water", color: "bg-sky-400" },
  { id: 25, name: "Pikachu", type: "Electric", color: "bg-yellow-400" },
];

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-bold text-slate-900">Pokedex</Text>

          <View className="h-10 w-10 rounded-full bg-white items-center justify-center shadow">
            <Text className="text-lg">≡</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-xl px-4 py-3 mb-6 shadow-sm">
          <TextInput
            placeholder="Search Pokémon..."
            placeholderTextColor="#94a3b8"
            className="text-base"
          />
        </View>

        {/* Pokemon Grid */}
        <FlatList
          data={MOCK_POKEMON}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ gap: 16 }}
          contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable className={`flex-1 rounded-2xl p-4 ${item.color}`}>
              <Text className="text-white font-bold text-lg">{item.name}</Text>

              <Text className="text-white/80 text-sm mt-1">
                #{String(item.id).padStart(3, "0")}
              </Text>

              <View className="mt-3 self-start bg-white/30 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">
                  {item.type}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
