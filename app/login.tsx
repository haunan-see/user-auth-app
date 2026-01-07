import Button from "@/components/Button"
import PasswordField from "@/components/PasswordField"
import TextField from "@/components/TextField"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    setError("")

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      router.replace("/(tabs)")
    } else {
      setError(result.error || "Login failed")
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            setError("")
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            setError("")
          }}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          disabled={!email.trim() || !password.trim()}
        />

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.linkText}>
            Don&apos;t have an account?{" "}
            <Text style={styles.linkTextBold}>Go to Signup</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  linkButton: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  linkTextBold: {
    color: "#007AFF",
    fontWeight: "600",
  },
})
