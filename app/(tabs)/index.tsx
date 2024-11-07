import { StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { initDB } from "../db";

export default function HomeScreen() {
  const [activity, setActivity] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        console.log("Database initialized successfully");
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };
    init();
  }, []);

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Select an activity</ThemedText>
      </ThemedView>
      <SegmentedButtons
        value={activity}
        onValueChange={setActivity}
        buttons={[
          {
            value: "walk",
            label: "Walking",
          },
          {
            value: "run",
            label: "Running",
          },
          { value: "cycle", label: "Cycling" },
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 16,
    overflow: "hidden",
    padding: 32,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
