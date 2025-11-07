'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { login, error, setError, checkAuthStatus } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isChecking, setIsChecking] = useState(true)

  // Check if user is already authenticated on mount
  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      setIsChecking(true)
      const currentUser = await checkAuthStatus()

      if (isMounted && currentUser) {
        // User is already logged in, redirect to dashboard
        router.push('/dashboard')
      }

      if (isMounted) {
        setIsChecking(false)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [checkAuthStatus, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    login.mutate({
      username: formData.username,
      password: formData.password,
    })
  }

  // Show loading while checking auth status
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
               
               
              </Field>
             
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="email"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={login.isPending}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='password'
                  required
                  disabled={login.isPending}
                />
              </Field>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Field>
                <Button
                  type="submit"
                  disabled={login.isPending}
                  className="w-full"
                >
                  {login.isPending ? 'Logging in...' : 'Login'}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
} 