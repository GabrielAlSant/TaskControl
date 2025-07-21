import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'

import TaskViewClient from '../_components/task-view-client'

export default async function ViewTaskPage({ params }: { params: { id: string } }) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      logs: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  })

  if (!task) {
    notFound()
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/task">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-2xl font-bold tracking-tight">
          Detalhes da Tarefa
        </h1>
      </div>
      <TaskViewClient initialTask={task} />
    </div>
  )
}