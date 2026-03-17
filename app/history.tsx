import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import type { Activity } from "../src/types/activity";
import { getActivities } from "../src/lib/db";
import { formatDate, formatDistance, formatDuration } from "../src/lib/format";

export default function HistoryScreen() {
    const [activities, setActivities] = useState<Activity[]>([]);

    useFocusEffect(
        useCallback(() => {
            setActivities(getActivities());
        }, [])
    );

    return (
        <View className="flex-1 bg-white p-4">
            <Text className="mb-4 text-2xl font-bold">History</Text>

            <FlatList
                data={activities}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View className="mt-10 items-center">
                        <Text className="text-lg font-semibold">Нема активности уште</Text>
                        <Text className="mt-2 text-zinc-500">
                            Сними ја првата рута од главниот екран.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push(`/activity/${item.id}`)}
                        className="mb-3 rounded-2xl bg-zinc-100 p-4"
                    >
                        <Text className="text-lg font-semibold">
                            {formatDate(item.createdAt)}
                        </Text>
                        <Text className="text-zinc-600">
                            {formatDistance(item.distanceMeters)}
                        </Text>
                        <Text className="text-zinc-600">
                            {formatDuration(item.durationSec)}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    );
}