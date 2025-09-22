import React, { createContext, useContext, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, AuthState, AuthError } from '@/types'
import { useAuthState } from '@/hooks/useAuthState'
import { createAppError, isNetworkError, getErrorMessage } from '@/lib/errorUtils'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, loading, setError } = useAuthState()
  const [signInLoading, setSignInLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    try {
      setSignInLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        const appError = createAppError(error)
        return { error: appError }
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Sign in error:', error)
      const appError = createAppError(error)
      return { error: appError }
    } finally {
      setSignInLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      // Continue with sign out even if there's an error
      // Network errors during sign out should not prevent the user from being signed out locally
      if (isNetworkError(error)) {
        console.warn('Network error during sign out, continuing with local sign out')
      }
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      const noUserError = createAppError(new Error('No user logged in'))
      return { error: noUserError }
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates as any)
        .eq('id', user.id)

      if (error) {
        const appError = createAppError(error)
        return { error: appError }
      }

      return { error: null }
    } catch (error: any) {
      console.error('Update profile error:', error)
      const appError = createAppError(error)
      return { error: appError }
    }
  }

  const value: AuthContextType = {
    user,
    loading: loading || signInLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    signIn,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
