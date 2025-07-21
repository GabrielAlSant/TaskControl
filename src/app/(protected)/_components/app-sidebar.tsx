'use client'

import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  UsersRound} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
   {
    title: 'Usuarios',
    url: '/user',
    icon: UsersRound,
  },
   {
    title: 'Tarefas',
    url: '/task',
    icon:  ClipboardList,
  }
]

export function AppSidebar() {
  const router = useRouter()
  const session = authClient.useSession()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
        },
      },
    })
  }
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
       <h1>Gestão de Tarefas</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div>
                    
                    <p className="text-muted-foreground text-sm flex">
                      {session.data?.user?.name}
         <Image
          className="ml-2"
          src="/config.png"
          alt="config"
          width={25}
          height={25}
        />
                    </p>
          
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}