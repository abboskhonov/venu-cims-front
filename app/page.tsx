'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login') // use replace() so it doesn't add to history
  }, [router])

  return null // no need to render anything
}
