export type Coord = {
    latitude: number;
    longitude: number;
};

export type Activity = {
    id: string;
    createdAt: string;
    durationSec: number;
    distanceMeters: number;
    coordinates: Coord[];
};