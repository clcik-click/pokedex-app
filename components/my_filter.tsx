import React from "react";
import { View, Text, Pressable, Modal } from "react-native";

type MyFilterType = {
  visible: boolean;
  selectedTypes: string[];
  allTypes: string[];
  onToggleType: (type: string) => void;
  onClear: () => void;
  onClose: () => void;
};

export default function MyFilter({
  visible,
  selectedTypes,
  allTypes,
  onToggleType,
  onClear,
  onClose,
}: MyFilterType) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Background overlay */}
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      {/* Bottom sheet */}
      <View className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl p-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold text-slate-900">Filter</Text>

          <Pressable
            onPress={onClear}
            className="px-3 py-2 rounded-xl bg-slate-100"
          >
            <Text className="text-slate-700 font-semibold">Clear</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {allTypes.map((t) => {
            const active = selectedTypes.includes(t);

            return (
              <Pressable
                key={t}
                onPress={() => onToggleType(t)}
                className={`px-3 py-2 rounded-full border ${
                  active
                    ? "bg-slate-900 border-slate-900"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text
                  className={`font-semibold capitalize ${
                    active ? "text-white" : "text-slate-700"
                  }`}
                >
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={onClose}
          className="mt-5 bg-slate-900 rounded-2xl py-3 items-center"
        >
          <Text className="text-white font-bold">Done</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
