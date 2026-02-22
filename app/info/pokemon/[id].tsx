import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePokemonInfoStore } from "../../../zustand/pokemonInfoStore";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function headerBgFromType(primaryType?: string) {
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
      return "bg-emerald-400";
  }
}

export default function PokemonDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pokemonId = Number(id);

  const open = usePokemonInfoStore((s) => s.open);
  const fetchIfNeeded = usePokemonInfoStore((s) => s.fetchIfNeeded);

  const tab = usePokemonInfoStore((s) => s.tab);
  const setTab = usePokemonInfoStore((s) => s.setTab);

  const details = usePokemonInfoStore((s) => s.byId[pokemonId]);
  const loading = usePokemonInfoStore((s) => s.loading);
  const error = usePokemonInfoStore((s) => s.error);

  useEffect(() => {
    if (!Number.isFinite(pokemonId)) return;
    open(pokemonId);
    fetchIfNeeded(pokemonId);
  }, [pokemonId]);

  const primaryType = details?.types?.[0];
  const headerBg = useMemo(() => headerBgFromType(primaryType), [primaryType]);

  if (loading && !details) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator />
        <Text className="mt-2 text-slate-500">Loading…</Text>
      </View>
    );
  }

  if (error && !details) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="text-red-700 font-semibold">Failed to load</Text>
        <Text className="text-red-700/80 mt-1 text-center">{error}</Text>
      </View>
    );
  }

  return (
    // ✅ Root background covers the whole screen
    <View className={`flex-1 ${headerBg}`}>
      {/* ✅ Only apply safe-area to TOP so bottom doesn't "reserve green space" */}
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Top Header */}
        <View className="px-5 pt-2 pb-96">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center"
              hitSlop={10}
            >
              <Text className="text-white text-2xl">←</Text>
            </Pressable>

            <Pressable
              className="h-10 w-10 items-center justify-center"
              hitSlop={10}
            >
              <Text className="text-white text-2xl">♡</Text>
            </Pressable>
          </View>

          <View className="mt-2 flex-row items-end justify-between">
            <Text className="text-white text-4xl font-extrabold capitalize">
              {details?.name}
            </Text>
            <Text className="text-white/80 text-lg font-bold">
              #{pad3(details?.id ?? pokemonId)}
            </Text>
          </View>

          <View className="mt-3 flex-row gap-2">
            {(details?.types ?? []).slice(0, 2).map((t) => (
              <View key={t} className="bg-white/25 px-4 py-2 rounded-full">
                <Text className="text-white font-semibold capitalize text-sm">
                  {t}
                </Text>
              </View>
            ))}
          </View>

          <View
            pointerEvents="none"
            className="absolute right-[-40px] top-[40px] h-56 w-56 rounded-full overflow-hidden opacity-15"
          >
            <Image
              source={require("../../../assets/pokemon_ball.png")}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Sprite (floating) */}
        <View
          pointerEvents="none"
          className="absolute left-0 right-0 top-[270px] items-center z-20"
        >
          {details?.sprite ? (
            <Image
              source={{ uri: details.sprite }}
              style={{ width: 220, height: 220 }}
              resizeMode="contain"
            />
          ) : (
            <View className="h-[220px] w-[220px] items-center justify-center">
              <ActivityIndicator />
            </View>
          )}
        </View>

        {/* Bottom Sheet */}
        <View className="flex-1 bg-white rounded-t-[32px] -mt-20 z-10">
          <ScrollView
            className="flex-1"
            // ✅ extra padding to visually cover the bottom + avoid home-indicator overlap
            contentContainerStyle={{ paddingBottom: 64 }}
          >
            <View className="h-12" />

            <View className="px-5">
              <View className="flex-row justify-between">
                <TabLabel
                  label="About"
                  active={tab === "about"}
                  onPress={() => setTab("about")}
                />
                <TabLabel
                  label="Base Stats"
                  active={tab === "stats"}
                  onPress={() => setTab("stats")}
                />
                <TabLabel
                  label="Evolution"
                  active={tab === "evolution"}
                  onPress={() => setTab("evolution")}
                />
                <TabLabel
                  label="Moves"
                  active={tab === "moves"}
                  onPress={() => setTab("moves")}
                />
              </View>

              <View className="mt-3 h-[2px] bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-indigo-500"
                  style={{
                    width: "25%",
                    marginLeft:
                      tab === "about"
                        ? "0%"
                        : tab === "stats"
                          ? "25%"
                          : tab === "evolution"
                            ? "50%"
                            : "75%",
                  }}
                />
              </View>
            </View>

            <View className="mt-6 px-5">
              {tab === "about" && (
                <View className="gap-5">
                  <InfoRow label="Species" value={"Seed"} />
                  <InfoRow
                    label="Height"
                    value={`${details?.heightDm ?? 0} dm`}
                  />
                  <InfoRow
                    label="Weight"
                    value={`${details?.weightHg ?? 0} hg`}
                  />
                  <InfoRow
                    label="Abilities"
                    value={(details?.abilities ?? []).join(", ")}
                  />

                  <Text className="mt-6 text-slate-900 text-xl font-extrabold">
                    Breeding
                  </Text>

                  <InfoRow label="Egg Groups" value={"Monster"} />
                  <InfoRow
                    label="Egg Cycle"
                    value={primaryType ? primaryType : "—"}
                  />
                </View>
              )}

              {tab === "stats" && (
                <View className="gap-3">
                  <StatRow label="HP" value={details?.stats?.hp ?? 0} />
                  <StatRow label="Attack" value={details?.stats?.attack ?? 0} />
                  <StatRow
                    label="Defense"
                    value={details?.stats?.defense ?? 0}
                  />
                  <StatRow label="Sp. Atk" value={details?.stats?.spAtk ?? 0} />
                  <StatRow label="Sp. Def" value={details?.stats?.spDef ?? 0} />
                  <StatRow label="Speed" value={details?.stats?.speed ?? 0} />
                  <View className="h-px bg-slate-200 my-2" />
                  <StatRow
                    label="Total"
                    value={details?.stats?.total ?? 0}
                    bold
                  />
                </View>
              )}

              {tab === "evolution" && (
                <View className="gap-2">
                  <Text className="text-slate-700">Evolution chain:</Text>
                  <Text className="text-slate-900 font-semibold">
                    {details?.evolutionChainUrl ?? "TODO"}
                  </Text>
                </View>
              )}

              {tab === "moves" && (
                <View className="gap-2">
                  {(details?.moves ?? []).slice(0, 18).map((m) => (
                    <Text key={m.name} className="text-slate-800 capitalize">
                      • {m.name}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function TabLabel({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <Text
        className={`text-sm ${
          active
            ? "text-slate-900 font-extrabold"
            : "text-slate-400 font-semibold"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-slate-400 font-semibold">{label}</Text>
      <Text className="text-slate-900 font-semibold">{value || "—"}</Text>
    </View>
  );
}

function StatRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-slate-500">{label}</Text>
      <Text
        className={`${bold ? "font-extrabold" : "font-semibold"} text-slate-900`}
      >
        {value}
      </Text>
    </View>
  );
}
