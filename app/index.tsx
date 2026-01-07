import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "expo-router"
import { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"

export default function Index() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/(tabs)")
      } else {
        router.replace("/login")
      }
    }
  }, [user, isLoading, router])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  )
}
