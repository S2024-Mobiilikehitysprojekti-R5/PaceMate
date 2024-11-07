import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useState, useCallback, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { exerciseQueries } from "./db";

interface ExerciseTrackerProps {
  activity: string;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function ExerciseTracker({ activity }: ExerciseTrackerProps) {
  const [isExercising, setIsExercising] = useState(false);
  const [timer, setTimer] = useState(0);
  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handleStartStop = useCallback(async () => {
    if (!isExercising) {
      try {
        const id = await exerciseQueries.startExercise(activity);
        setExerciseId(id);
        setIsExercising(true);
        console.log("Started exercise:", id);

        const interval = setInterval(() => {
          setTimer((prev) => prev + 1);
        }, 1000);
        setIntervalId(interval);
      } catch (error) {
        console.error("Failed to start exercise:", error);
      }
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }

      try {
        if (exerciseId) {
          await exerciseQueries.finishExercise(exerciseId, timer, 0, 0);
        }
        setIsExercising(false);
        setTimer(0);
        setExerciseId(null);
        const exercise = await exerciseQueries.getExerciseById(exerciseId!);
        console.log("Finished exercise:", exercise);
      } catch (error) {
        console.error("Failed to finish exercise:", error);
      }
    }
  }, [activity, isExercising, exerciseId, timer, intervalId]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <>
      <Button mode="contained" onPress={handleStartStop} disabled={!activity}>
        {isExercising ? "Stop exercise" : "Start exercise"}
      </Button>

      {isExercising && (
        <ThemedView style={styles.timerContainer}>
          <ThemedText style={styles.timer}>{formatTime(timer)}</ThemedText>
        </ThemedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 56,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 24,
  },
});
