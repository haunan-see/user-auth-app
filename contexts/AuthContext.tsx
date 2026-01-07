import AsyncStorage from "@react-native-async-storage/async-storage"
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

interface User {
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  clearAllData: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_STORAGE_KEY = "@users"
const CURRENT_USER_KEY = "@current_user"

type StoredUser = { name: string; email: string; password: string }

const getUsers = async (): Promise<StoredUser[]> => {
  const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY)
  return usersJson ? JSON.parse(usersJson) : []
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY)
      if (userJson) {
        setUser(JSON.parse(userJson))
      }
    } catch (error) {
      console.error("Error loading user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveCurrentUser = useCallback(async (userData: User) => {
    setUser(userData)
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
  }, [])

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        if (!validateEmail(email)) {
          return { success: false, error: "Invalid email format" }
        }

        const users = await getUsers()
        const foundUser = users.find(
          (user) => user.email === email && user.password === password
        )

        if (!foundUser) {
          return { success: false, error: "Incorrect email or password" }
        }

        const userData: User = { name: foundUser.name, email: foundUser.email }
        await saveCurrentUser(userData)

        return { success: true }
      } catch (error) {
        return { success: false, error: "Error: " + error }
      }
    },
    [saveCurrentUser]
  )

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        if (!name.trim() || !email.trim() || !password.trim()) {
          return { success: false, error: "All fields are required" }
        }

        if (!validateEmail(email)) {
          return { success: false, error: "Invalid email format" }
        }

        if (password.length < 6) {
          return {
            success: false,
            error: "Password must be at least 6 characters",
          }
        }

        const users = await getUsers()
        if (users.some((user) => user.email === email)) {
          return {
            success: false,
            error: "User with this email already exists",
          }
        }

        const newUser = { name: name.trim(), email: email.trim(), password }
        users.push(newUser)
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

        const userData: User = { name: newUser.name, email: newUser.email }
        await saveCurrentUser(userData)

        return { success: true }
      } catch (error) {
        return { success: false, error: "Error: " + error }
      }
    },
    [saveCurrentUser]
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      setUser(null)
      await AsyncStorage.removeItem(CURRENT_USER_KEY)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }, [])

  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      setUser(null)
      await AsyncStorage.removeItem(CURRENT_USER_KEY)
      await AsyncStorage.removeItem(USERS_STORAGE_KEY)
    } catch (error) {
      console.error("Error clearing data:", error)
    }
  }, [])

  const value = useMemo(
    () => ({ user, login, signup, logout, clearAllData, isLoading }),
    [user, login, signup, logout, clearAllData, isLoading]
  )

  useEffect(() => {
    loadUser()
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
