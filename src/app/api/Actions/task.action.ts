'use server'

import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers' 

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export type CreateTaskInput = {
  title: string
  description: string
  status: 'não iniciada' | 'em análise' | 'concluída'
}

export async function createTask(data: CreateTaskInput) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) return { error: 'Usuário não autenticado.' }

  try {
    const task = await prisma.$transaction(async (tx) => {
      const newTask = await tx.task.create({ data: { ...data, userId: session.user.id } })
      await tx.log.create({ data: { taskId: newTask.id, oldStatus: 'Tarefa Criada', newStatus: newTask.status, date: new Date() } })
      return newTask
    })
    revalidatePath('/task')
    return { task }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) { return { error: 'Ocorreu um erro ao criar a tarefa.' } }
}

export async function updateTask(id: string, data: Prisma.TaskUpdateInput) {
  const session = await auth.api.getSession({ headers: await headers() }) 
  if (!session?.user?.id) return { error: 'Usuário não autenticado.' }

  try {
    const updatedTask = await prisma.$transaction(async (tx) => {
      const currentTask = await tx.task.findUnique({ where: { id, userId: session.user.id } })
      if (!currentTask) throw new Error('Tarefa não encontrada ou permissão negada.')
      const oldStatus = currentTask.status
      const taskAfterUpdate = await tx.task.update({ where: { id }, data })
      const newStatus = taskAfterUpdate.status
      if (typeof newStatus === 'string' && oldStatus !== newStatus) {
        await tx.log.create({ data: { taskId: id, oldStatus, newStatus, date: new Date() } })
      }
      return taskAfterUpdate
    })
    revalidatePath('/task')
    return { task: updatedTask }
  } catch (error) {
    if (error instanceof Error) return { error: error.message }
    return { error: 'Ocorreu um erro desconhecido ao atualizar.' }
  }
}

export async function deleteTask(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) return { error: 'Usuário não autenticado.' }

  try {
    const task = await prisma.task.delete({ where: { id, userId: session.user.id } })
    revalidatePath('/task')
    return { task }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) { return { error: 'Ocorreu um erro ao excluir a tarefa.' } }
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const session = await auth.api.getSession({ headers: await headers() }) 
  if (!session?.user) return { error: 'Não autorizado' }

  try {
    const updatedTask = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } })
      if (!task) throw new Error('Tarefa não encontrada.')
      const oldStatus = task.status
      if (oldStatus === newStatus) return task
      const taskAfterUpdate = await tx.task.update({ where: { id: taskId }, data: { status: newStatus } })
      await tx.log.create({ data: { taskId, oldStatus, newStatus, date: new Date() } })
      return taskAfterUpdate
    })
    revalidatePath(`/task/viewTask/${taskId}`)
    revalidatePath('/task')
    return { task: updatedTask }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) { return { error: 'Falha ao atualizar o status.' } }
}

export async function createComment(taskId: string, text: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  console.log("texto sadasdasdad asdd sa",text)
  if (!session?.user?.id) return { error: 'Não autorizado' }
  try {
    const comment = await prisma.comment.create({
      data: { text, createdAt: new Date(), taskId, userId: session.user.id  },
      include: { user: true },
    })
    revalidatePath(`/task/viewTask/${taskId}`)
    return { comment }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) { 
    console.log(error)
    return { error: 'Falha ao adicionar o comentário.' } }
}