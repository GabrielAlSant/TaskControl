import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import LoginForm from '@/components/login-form'
import RegisterForm from '@/components/register-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@/lib/auth'

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user) {
    redirect('/dashboard')
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AuthenticationPage
