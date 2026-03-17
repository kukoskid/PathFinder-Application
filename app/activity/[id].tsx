import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import MapView, { Polyline, UrlTile } from "react-native-maps";
import { getActivityById } from "../../src/lib/db";
import {
    formatDate,
    formatDistance,
    formatDuration,
} from "../../src/lib/format";
import {
    MAPTILER_KEY,
    MAPTILER_URL_TEMPLATE,
} from "../../src/lib/maptiler";

export default function ActivityDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const activity = getActivityById(id);

    if (!activity) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text>Активноста не е пронајдена.</Text>
            </View>
        );
    }

    const first = activity.coordinates[0];

    return (
        <View className="flex-1 bg-white">
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: first.latitude,
                    longitude: first.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                {MAPTILER_KEY ? (
                    <UrlTile
                        urlTemplate={MAPTILER_URL_TEMPLATE}
                        maximumZ={19}
                        flipY={false}
                    />
                ) : null}

                <Polyline coordinates={activity.coordinates} strokeWidth={5} />
            </MapView>

            <View className="rounded-t-3xl bg-white p-4 gap-2">
                <Text className="text-xl font-bold">
                    {formatDate(activity.createdAt)}
                </Text>
                <Text>{formatDistance(activity.distanceMeters)}</Text>
                <Text>{formatDuration(activity.durationSec)}</Text>
                <Text>{activity.coordinates.length} точки</Text>
            </View>
        </View>
    );
}