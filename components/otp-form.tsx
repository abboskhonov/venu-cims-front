'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useAuth } from '@/hooks/useAuth'

interface OTPFormProps extends React.ComponentProps<typeof Card> {
  email: string
}

export function OTPForm({  ...props }: OTPFormProps) {
  const { verifyOTP, resendOTP, error, setError } = useAuth()
  const [otp, setOtp] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (otp.length !== 4) {
      setError('Please enter a valid 4-digit code')
      return
    }

    verifyOTP.mutate({ email, code: otp })
  }

  const handleResend = async () => {
    setError(null)
    setResendCooldown(60)
    
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    resendOTP.mutate(email)
  }

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Enter verification code</CardTitle>
        <CardDescription>We sent a 4-digit code to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={4} value={otp} onChange={setOtp} required>
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button 
            type="submit" 
            disabled={verifyOTP.isLoading || otp.length !== 4}
            className="w-full"
          >
            {verifyOTP.isLoading ? 'Verifying...' : 'Verify'}
          </Button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resendOTP.isLoading}
              className="text-primary hover:underline disabled:text-muted-foreground"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}