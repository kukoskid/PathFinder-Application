import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { useTrackingStore } from "../store/tracking-store";

export function useTracking() {
    const {
        isTracking,
        coordinates,
        durationSec,
        distanceMeters,
        addPoint,
        start,
        stop,
        reset,
        tick,
    } = useTrackingStore();

    const [permissionDenied, setPermissionDenied] = useState(false);
    const [currentLocation, setCurrentLocation] =
        useState<Location.LocationObjectCoords | null>(null);

    const subRef = useRef<Location.LocationSubscription | null>(null);

    useEffect(() => {
        const timer = setInterval(() => tick(), 1000);
        return () => clearInterval(timer);
    }, [tick]);

    async function requestPermission() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const granted = status === "granted";
        setPermissionDenied(!granted);
        return granted;
    }

    async function loadInitialLocation() {
        const granted = await requestPermission();
        if (!granted) return;

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
    }

    async function startTracking() {
        const granted = await requestPermission();
        if (!granted) return;

        start();

        const first = await Location.getCurrentPositionAsync({});
        setCurrentLocation(first.coords);
        addPoint({
            latitude: first.coords.latitude,
            longitude: first.coords.longitude,
        });

        subRef.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                timeInterval: 3000,
                distanceInterval: 5,
            },
            (location) => {
                setCurrentLocation(location.coords);
                addPoint({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        );
    }

    function stopTracking() {
        subRef.current?.remove();
        subRef.current = null;
        stop();
    }

    function clearTracking() {
        subRef.current?.remove();
        subRef.current = null;
        reset();
    }

    useEffect(() => {
        loadInitialLocation();

        return () => {
            subRef.current?.remove();
        };
    }, []);

    return {
        isTracking,
        coordinates,
        durationSec,
        distanceMeters,
        currentLocation,
        permissionDenied,
        startTracking,
        stopTracking,
        clearTracking,
    };
}