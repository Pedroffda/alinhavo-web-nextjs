'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScissorsIcon } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <ScissorsIcon className="h-8 w-8 text-[#ff9900] mr-2" />
            <CardTitle className="text-2xl font-bold">Alinhavo</CardTitle>
          </div>
          <CardDescription>
            Seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSignOut}>
            Sair
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}