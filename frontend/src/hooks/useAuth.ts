import { useAuthContext } from '../context/AuthContext'

export function useAuth() {
  const { user, session, loading, signOut } = useAuthContext()
  return {
    user,
    session,
    token: session?.access_token ?? null,
    loading,
    signOut,
    isAuthenticated: !!user,
  }
}
