import { Alert, Text, View, Pressable } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";
import { useTracking } from "../src/hooks/useTracking";
import { saveActivity } from "../src/lib/db";
import { formatDistance, formatDuration } from "../src/lib/format";
import { MAPTILER_URL_TEMPLATE, MAPTILER_KEY } from "../src/lib/maptiler";

export default function HomeScreen() {
  const {
    isTracking,
    coordinates,
    durationSec,
    distanceMeters,
    currentLocation,
    permissionDenied,
    locationError,
    startTracking,
    stopTracking,
    clearTracking,
  } = useTracking();

  useEffect(() => {
    if (permissionDenied) {
      Alert.alert(
          "Location permission denied",
          "Дозволи локација во settings за tracking да работи."
      );
    }
  }, [permissionDenied]);

  function onSave() {
    stopTracking();

    if (coordinates.length < 2 || distanceMeters < 10) {
      Alert.alert("Премалку податоци (минимум 10 метра)", "Прошетај малку повеќе пред да зачуваш. Активноста ќе почне од почеток.");
      return;
    }

    saveActivity({
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      durationSec,
      distanceMeters,
      coordinates,
    });

    clearTracking();
    router.push("/history");
  }

  return (
      <View className="flex-1 bg-white">
        <MapView
            style={{ flex: 1 }}
            showsUserLocation
            followsUserLocation
            initialRegion={{
              latitude: currentLocation?.latitude ?? 41.9981,
              longitude: currentLocation?.longitude ?? 21.4254,
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

          {currentLocation && (
              <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
              />
          )}

          {coordinates.length > 0 && (
              <Polyline coordinates={coordinates} strokeWidth={5} />
          )}
        </MapView>

        <View className="gap-3 rounded-t-3xl bg-white p-4">
          <Text className="text-2xl font-bold">PathFinder</Text>

          {locationError ? (
              <Text className="text-sm text-red-600">{locationError}</Text>
          ) : null}

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-zinc-100 p-3">
              <Text className="text-zinc-500">Duration</Text>
              <Text className="text-lg font-semibold">
                {formatDuration(durationSec)}
              </Text>
            </View>

            <View className="flex-1 rounded-2xl bg-zinc-100 p-3">
              <Text className="text-zinc-500">Distance</Text>
              <Text className="text-lg font-semibold">
                {formatDistance(distanceMeters)}
              </Text>
            </View>
          </View>

          {!isTracking ? (
              <Pressable
                  onPress={startTracking}
                  className="rounded-2xl bg-black py-4"
              >
                <Text className="text-center font-semibold text-white">
                  Start Tracking
                </Text>
              </Pressable>
          ) : (
              <Pressable onPress={onSave} className="rounded-2xl bg-red-600 py-4">
                <Text className="text-center font-semibold text-white">
                  Stop & Save
                </Text>
              </Pressable>
          )}

          <Pressable onPress={() => router.push("/history")}>
            <Text className="text-center font-medium text-blue-600">
              Open History
            </Text>
          </Pressable>
        </View>
      </View>
  );
}
