import React from "react";
import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function colorFromType(primaryType?: string) {
  switch (primaryType) {
    case "grass":
      return "bg-emerald-400";
    case "fire":
      return "bg-red-400";
    case "water":
      return "bg-sky-400";
    case "electric":
      return "bg-yellow-400";
    case "psychic":
      return "bg-pink-400";
    case "ice":
      return "bg-cyan-400";
    case "dragon":
      return "bg-indigo-500";
    case "dark":
      return "bg-slate-700";
    case "fairy":
      return "bg-fuchsia-400";
    case "fighting":
      return "bg-orange-500";
    case "poison":
      return "bg-purple-500";
    case "ground":
      return "bg-amber-600";
    case "rock":
      return "bg-stone-500";
    case "bug":
      return "bg-lime-500";
    case "ghost":
      return "bg-violet-600";
    case "steel":
      return "bg-zinc-500";
    case "flying":
      return "bg-indigo-300";
    case "normal":
      return "bg-slate-400";
    default:
      return "bg-indigo-400";
  }
}

type MyCardType = {
  id: number;
  name: string;
  types?: string[];
  sprite?: string | null;
};

export default function MyCard({ id, name, types = [], sprite }: MyCardType) {
  const primaryType = types?.[0];
  const bg = colorFromType(primaryType);

  return (
    <Pressable
      onPress={() => router.push(`/info/pokemon/${id}`)}
      //   className={`flex-1 rounded-2xl px-4 py-3 overflow-hidden ${bg}`}
      className={`w-[48%] rounded-2xl px-4 py-3 overflow-hidden ${bg}`}
    >
      <View style={{ minHeight: 120 }}>
        {/* 🔥 Background Pokeball */}
        <View className="absolute right-[-24px] bottom-[-24px] h-40 w-40 rounded-full overflow-hidden opacity-10">
          <Image
            source={require("../assets/pokemon_ball.png")}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-white font-bold text-lg capitalize flex-1">
            {name}
          </Text>

          <Text className="text-white/80 text-sm font-semibold">
            #{pad3(id)}
          </Text>
        </View>

        <View className="mt-2 gap-2">
          {types.slice(0, 2).map((t) => (
            <View
              key={t}
              className="self-start bg-white/25 px-3 py-1 rounded-full"
            >
              <Text className="text-white text-xs font-semibold capitalize">
                {t}
              </Text>
            </View>
          ))}
        </View>

        {/* Foreground sprite */}
        <View className="absolute right-0 bottom-0">
          {sprite ? (
            <Image
              source={{ uri: sprite }}
              style={{ width: 92, height: 92 }}
              resizeMode="contain"
            />
          ) : (
            <View className="h-[92px] w-[92px] items-center justify-center">
              <ActivityIndicator />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
