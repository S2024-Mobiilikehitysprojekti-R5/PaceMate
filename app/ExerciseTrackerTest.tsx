import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useState, useCallback, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { exerciseQueries, Exercise } from "./db";

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
  const [startTime, setStartTime] = useState<string | null>(null);
  const [finishedExercise, setFinishedExercise] = useState<Exercise | null>(
    null
  );

  const handleStartStop = useCallback(async () => {
    if (!isExercising) {
      try {
        const startTimeNow = new Date().toISOString();
        setStartTime(startTimeNow);
        const id = await exerciseQueries.startExercise(activity);
        setExerciseId(id);
        setIsExercising(true);
        setFinishedExercise(null);
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
          const exercise = await exerciseQueries.getExerciseById(exerciseId);
          setFinishedExercise(exercise);
        }
        setIsExercising(false);
        setTimer(0);
        setExerciseId(null);
        setStartTime(null);
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
        {isExercising ? "Stop" : "Start"}
      </Button>

      {isExercising && (
        <ThemedView style={styles.timerContainer}>
          <ThemedText style={styles.timer}>{formatTime(timer)}</ThemedText>
          <ThemedText>Exercise ID: {exerciseId}</ThemedText>
          <ThemedText>
            Start Time: {new Date(startTime!).toLocaleTimeString()}
          </ThemedText>
          <ThemedText>Activity: {activity}</ThemedText>
        </ThemedView>
      )}

      {finishedExercise && (
        <ThemedView style={styles.summaryContainer}>
          <ThemedText type="subtitle">Exercise Summary</ThemedText>
          <ThemedText>ID: {finishedExercise.id}</ThemedText>
          <ThemedText>Type: {finishedExercise.type}</ThemedText>
          <ThemedText>
            Start: {new Date(finishedExercise.start_time).toLocaleTimeString()}
          </ThemedText>
          <ThemedText>
            End: {new Date(finishedExercise.end_time!).toLocaleTimeString()}
          </ThemedText>
          <ThemedText>
            Duration: {formatTime(finishedExercise.duration!)}
          </ThemedText>
        </ThemedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    alignItems: "center",
    borderRadius: 8,
    gap: 8,
    justifyContent: "center",
    marginTop: 24,
    padding: 16,
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 56,
  },
  timerContainer: {
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 24,
  },
});
