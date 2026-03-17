import type { Coord } from "../types/activity";

const toRad = (value: number) => (value * Math.PI) / 180;

export function haversineDistance(a: Coord, b: Coord) {
    const R = 6371000;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);

    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const x =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return R * c;
}

export function totalDistance(coords: Coord[]) {
    if (coords.length < 2) return 0;

    let total = 0;
    for (let i = 1; i < coords.length; i++) {
        total += haversineDistance(coords[i - 1], coords[i]);
    }
    return total;
}