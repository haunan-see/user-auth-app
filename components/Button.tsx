import { Ionicons } from "@expo/vector-icons"
import React from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native"

interface ButtonProps extends TouchableOpacityProps {
  title: string
  loading?: boolean
  variant?: "primary" | "danger"
  icon?: keyof typeof Ionicons.glyphMap
}

export default function Button({
  title,
  loading = false,
  variant = "primary",
  disabled,
  style,
  icon,
  ...touchableProps
}: Readonly<ButtonProps>) {
  const buttonStyle = variant === "danger" ? styles.buttonDanger : styles.button

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        (disabled || loading) && styles.buttonDisabled,
        icon && styles.buttonWithIcon,
        style,
      ]}
      disabled={disabled || loading}
      {...touchableProps}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <Ionicons name={icon} size={24} color="#fff" />}
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDanger: {
    backgroundColor: "#d32f2f",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonWithIcon: {
    flexDirection: "row",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
})
