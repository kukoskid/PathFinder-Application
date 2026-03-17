import { create } from "zustand";
import type { Coord } from "../types/activity";
import { totalDistance, haversineDistance } from "../lib/distance";

type TrackingState = {
    isTracking: boolean;
    startedAt: number | null;
    coordinates: Coord[];
    durationSec: number;
    distanceMeters: number;
    start: () => void;
    stop: () => void;
    reset: () => void;
    addPoint: (coord: Coord) => void;
    tick: () => void;
};

export const useTrackingStore = create<TrackingState>((set, get) => ({
    isTracking: false,
    startedAt: null,
    coordinates: [],
    durationSec: 0,
    distanceMeters: 0,

    start: () =>
        set({
            isTracking: true,
            startedAt: Date.now(),
            coordinates: [],
            durationSec: 0,
            distanceMeters: 0,
        }),

    stop: () => set({ isTracking: false }),

    reset: () =>
        set({
            isTracking: false,
            startedAt: null,
            coordinates: [],
            durationSec: 0,
            distanceMeters: 0,
        }),

    addPoint: (coord) => {
        const prev = get().coordinates[get().coordinates.length - 1];

        if (prev) {
            const delta = haversineDistance(prev, coord);
            if (delta < 3) return;
        }

        const next = [...get().coordinates, coord];
        set({
            coordinates: next,
            distanceMeters: totalDistance(next),
        });
    },

    tick: () => {
        const { startedAt, isTracking } = get();
        if (!startedAt || !isTracking) return;

        set({
            durationSec: Math.floor((Date.now() - startedAt) / 1000),
        });
    },
}));