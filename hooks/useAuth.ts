'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { register, login, getCurrentUser, verifyOTP, RegisterData, LoginData, User } from '@/lib/api/auth'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  // -------------------------
  // Fetch current user
  // -------------------------
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    onError: () => setError('Not authenticated'),
  })

  // Query to refetch user (used by checkAuthStatus)
  const { refetch: refetchUser } = useQuery<User>({
    queryKey: ['currentUser', 'refetch'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: false,
  })

  // -------------------------
  // Register mutation
  // -------------------------
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: (data) => {
      // Store email temporarily for OTP verification
      // DO NOT redirect here - wait for OTP verification
      sessionStorage.setItem('pendingEmail', data.email)
      sessionStorage.setItem('isAwaitingOTP', 'true')
    },
    onError: (err: any) => setError(err instanceof Error ? err.message : 'Registration failed'),
  })

  // -------------------------
  // Verify OTP mutation
  // -------------------------
  const verifyOTPMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyOTP(data),
    onSuccess: (data) => {
      // ✅ Save token to localStorage only
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token)
        }
      }

      // Clear OTP session data
      sessionStorage.removeItem('pendingEmail')
      sessionStorage.removeItem('isAwaitingOTP')

      // Update cache and redirect
      queryClient.setQueryData(['currentUser'], data.user)
      router.push('/dashboard')
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err.message : 'OTP verification failed')
    },
  })

  // -------------------------
  // Resend OTP mutation
  // -------------------------
  const resendOTPMutation = useMutation({
    mutationFn: (email: string) => {
      return verifyOTP({ email, otp: '' }) // Backend should handle resend
    },
    onSuccess: () => {
      setError(null)
    },
    onError: (err: any) => setError(err instanceof Error ? err.message : 'Failed to resend OTP'),
  })

  // -------------------------
  // Login mutation
  // -------------------------
  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (data) => {
      // ✅ Save token to localStorage only
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token)
        }
      }

      // Update cache and redirect
      queryClient.setQueryData(['currentUser'], data.user)
      router.push('/dashboard')
    },
    onError: (err: any) => setError(err instanceof Error ? err.message : 'Login failed'),
  })

  // Function to check user auth status (call this on app startup/layout)
  const checkAuthStatus = useCallback(async () => {
    try {
      const result = await refetchUser()
      if (result.data) {
        queryClient.setQueryData(['currentUser'], result.data)
        return result.data
      }
      return null
    } catch (err) {
      queryClient.setQueryData(['currentUser'], null)
      return null
    }
  }, [queryClient, refetchUser])

  // Logout function
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    
    // Clear cache
    queryClient.setQueryData(['currentUser'], null)
    queryClient.clear()
    
    // Redirect to login
    router.push('/login')
  }, [queryClient, router])

  return {
    user,
    isUserLoading,
    error,
    setError,
    register: registerMutation,
    verifyOTP: verifyOTPMutation,
    resendOTP: resendOTPMutation,
    login: loginMutation,
    logout,
    checkAuthStatus,
  }
}