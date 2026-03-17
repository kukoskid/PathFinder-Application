import "../global.css";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDb } from "../src/lib/db";

export default function RootLayout() {
    useEffect(() => {
        initDb();
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="history" />
            <Stack.Screen name="activity/[id]" />
        </Stack>
    );
}