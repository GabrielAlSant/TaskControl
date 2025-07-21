import { headers } from 'next/headers'
import { redirect } from 'next/navigation' 

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

import { TaskForm } from '../../_components/task-form'


export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const userId = session?.user?.id

  if (!userId) {
    return redirect('/')
  }

  const task = await prisma.task.findUnique({
    where: {
      id: params.id,
      userId: userId,
    },
  })

  return (
    <div className="p-4 md:p-8">
      <TaskForm task={task} />
    </div>
  )
}