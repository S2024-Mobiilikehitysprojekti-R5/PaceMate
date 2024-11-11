import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, FAB, useTheme, Text } from "react-native-paper";
import Toast from "react-native-root-toast";
import { initDB } from "@/database";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  // FIXME: Move to Context
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    (async () => {
      await initDB();
      console.log("Database initialized");
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content
          title={
            <Text variant="headlineMedium">
              <Text style={{ ...styles.appTitle, color: "white" }}>Pace</Text>
              <Text style={{ ...styles.appTitle, color: "orange" }}>Mate</Text>
            </Text>
          }
        />
        <Appbar.Action icon="cog" onPress={() => router.push("/settings")} />
      </Appbar.Header>
      <View style={styles.content}>
        <FAB
          icon={isTracking ? "stop" : "record"}
          label={isTracking ? "Stop" : "Start"}
          onPress={() => {
            if (isTracking) {
              Toast.show("Long press to stop", {
                duration: Toast.durations.SHORT,
              });
            } else {
              setIsTracking(true);
            }
          }}
          // Using long press prevents accidentally stopping the tracking
          onLongPress={() => setIsTracking(false)}
          color={isTracking ? theme.colors.onError : theme.colors.onPrimary}
          style={{
            ...styles.fab,
            backgroundColor: isTracking
              ? theme.colors.error
              : theme.colors.primary,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    fontStyle: "italic",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    gap: 16,
    overflow: "hidden",
    padding: 32,
  },
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
});
