import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation' 

import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'

import UserTaskView from '../_components/user-task-view'

interface ViewUserPageProps {
  params: { id: string }
  searchParams?: { q?: string }
}

export default async function ViewUserPage({ params, searchParams }: ViewUserPageProps) {
  const userId = params.id
  const query = searchParams?.q || ''
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
     return redirect('/')
  }

  const allTasks = await prisma.task.findMany({
    where: { userId: userId },
  })
  

  const filteredTasks = await prisma.task.findMany({
    where: { 
      userId: userId,
      title: {
        contains: query,
        mode: 'insensitive'
      }
    },
    orderBy: { id: 'desc' }
  })

  const stats = allTasks.reduce(
    (acc, task) => {
      if (task.status === 'concluída') acc.concluida++
      if (task.status === 'em análise') acc.emAnalise++
      if (task.status === 'não iniciada') acc.naoIniciada++
      return acc
    },
    { concluida: 0, emAnalise: 0, naoIniciada: 0, total: allTasks.length }
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/user">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
         {user.name}
        </h1>
      </div>
      <UserTaskView user={user} stats={stats} tasks={filteredTasks} />
    </div>
  )
}