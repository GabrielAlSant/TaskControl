import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

import { TaskForm } from '../../_components/task-form'

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditTaskPage({ params }: PageProps) {
  const session = await auth.api.getSession({
      headers: await headers(),
})
  const userId = session?.user?.id

  if (!userId) {
    return notFound() 
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