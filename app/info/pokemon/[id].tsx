import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";

export default function PokemonDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable
            onPress={() => router.back()}
            className="h-10 px-4 rounded-full bg-white items-center justify-center shadow"
          >
            <Text>Back</Text>
          </Pressable>
          <Text className="text-xl font-bold text-slate-900">
            Pokemon #{id}
          </Text>
          <View className="w-16" />
        </View>

        <Text className="text-slate-700">
          Details screen goes here (fetch full pokemon/:id).
        </Text>
      </View>
    </SafeAreaView>
  );
}
