import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";

type MySeachType = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
};

export default function MySearch({
  value,
  onChange,
  placeholder = "Search name or #id (e.g. pikachu, #25)",
  onClear,
}: MySeachType) {
  return (
    <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-4 shadow">
      <Text className="mr-2">🔎</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        autoCorrect={false}
        className="flex-1 text-slate-900"
      />

      {value.length > 0 ? (
        <Pressable onPress={onClear ?? (() => onChange(""))} className="ml-2">
          <Text className="text-slate-500 text-lg">✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
