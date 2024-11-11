import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { SegmentedButtons, Switch } from "react-native-paper";

export default function SettingsScreen() {
  const [value, setValue] = useState("");
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  return (
    <View style={styles.content}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: "walk",
            label: "Walking",
          },
          {
            value: "train",
            label: "Transit",
          },
          { value: "drive", label: "Driving" },
        ]}
      />
      <Switch
        value={isSwitchOn}
        onValueChange={() => setIsSwitchOn(!isSwitchOn)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 16,
    overflow: "hidden",
    padding: 32,
  },
});
