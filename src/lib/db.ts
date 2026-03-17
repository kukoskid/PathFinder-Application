import * as SQLite from "expo-sqlite";
import type { Activity } from "../types/activity";

const db = SQLite.openDatabaseSync("pathfinder.db");

export function initDb() {
    db.execSync(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY NOT NULL,
      createdAt TEXT NOT NULL,
      durationSec INTEGER NOT NULL,
      distanceMeters REAL NOT NULL,
      coordinatesJson TEXT NOT NULL
    );
  `);
}

export function saveActivity(activity: Activity) {
    db.runSync(
        `INSERT INTO activities (id, createdAt, durationSec, distanceMeters, coordinatesJson)
     VALUES (?, ?, ?, ?, ?)`,
        [
            activity.id,
            activity.createdAt,
            activity.durationSec,
            activity.distanceMeters,
            JSON.stringify(activity.coordinates),
        ]
    );
}

export function getActivities(): Activity[] {
    const rows = db.getAllSync<{
        id: string;
        createdAt: string;
        durationSec: number;
        distanceMeters: number;
        coordinatesJson: string;
    }>(`SELECT * FROM activities ORDER BY createdAt DESC`);

    return rows.map((row) => ({
        id: row.id,
        createdAt: row.createdAt,
        durationSec: row.durationSec,
        distanceMeters: row.distanceMeters,
        coordinates: JSON.parse(row.coordinatesJson),
    }));
}

export function getActivityById(id: string): Activity | null {
    const row = db.getFirstSync<{
        id: string;
        createdAt: string;
        durationSec: number;
        distanceMeters: number;
        coordinatesJson: string;
    }>(`SELECT * FROM activities WHERE id = ?`, [id]);

    if (!row) return null;

    return {
        id: row.id,
        createdAt: row.createdAt,
        durationSec: row.durationSec,
        distanceMeters: row.distanceMeters,
        coordinates: JSON.parse(row.coordinatesJson),
    };
}