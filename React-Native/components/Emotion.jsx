import React from "react";
import { Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Emotion = ({
  size = 100,
  borderRadius = 50,
  colorIndex = 0,
  label = "",
  showLabel = true,
  fontSize = 18,
  fontFamily = "Arial",
  fontWeight = "bold",
  margin = 10,
}) => {
  const colorGradients = [
    ["#FE7A40", "#F5365B"],
    ["#FAE36B", "#FDB61D"],
    ["#87C1FD", "#7282FF"],
    ["#88EEA3", "#41C888"],
  ];

  const selectedGradient = colorGradients[colorIndex % colorGradients.length];

  return (
    <LinearGradient
      colors={selectedGradient}
      style={[
        styles.emotion,
        {
          width: size,
          height: size,
          borderRadius: borderRadius,
          margin: margin,
        },
      ]}
    >
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              fontSize: fontSize,
              fontFamily: fontFamily,
              fontWeight: fontWeight,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  emotion: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    textAlign: "center",
  },
});

export default Emotion;
