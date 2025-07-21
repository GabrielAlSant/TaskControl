import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'

import { AppSidebar } from './_components/app-sidebar'

export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
