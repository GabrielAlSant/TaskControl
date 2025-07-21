import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

import TasksTable from './_components/tasks-table' 

export default async function TarefasPage({
  searchParams,
}: {
  searchParams?: { q?: string }
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect('/')
  }

  const query = searchParams?.q || ''

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      title: {
        contains: query,
        mode: 'insensitive',
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Minhas Tarefas</h1>
      </div>
      <TasksTable tasks={tasks} />
    </div>
  )
}
