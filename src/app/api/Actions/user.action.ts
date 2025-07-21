'use server'

import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function createUser(data: Prisma.UserCreateInput) {
  const session = await auth.api.getSession({
        headers: await headers(),
  })
  if (!session?.user?.id) {
    return { error: 'Ação não autorizada.' }
  }

  try {
    const user = await prisma.user.create({
      data,
    })
    revalidatePath('/user')
    return { user }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'Já existe um usuário com este e-mail.' }
    }
    return { error: 'Ocorreu um erro ao criar o usuário.' }
  }
}
export async function updateUser(id: string, data: Prisma.UserUpdateInput) {
  const session = await auth.api.getSession({
        headers: await headers(),
  })
  if (!session?.user?.id) {
    return { error: 'Ação não autorizada.' }
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    })
    revalidatePath('/dashboard/usuarios')
    return { user }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'Já existe um usuário com este e-mail.' }
    }
    return { error: 'Ocorreu um erro ao atualizar o usuário.' }
  }
}

export async function deleteUser(id: string) {
  const session = await auth.api.getSession({
        headers: await headers(),
  })
  if (!session?.user?.id) {
    return { error: 'Ação não autorizada.' }
  }
  
  if (session.user.id === id) {
    return { error: 'Você não pode excluir a si mesmo.' }
  }

  try {
    const user = await prisma.user.delete({
      where: { id },
    })
    revalidatePath('/dashboard/usuarios')
    return { user }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: 'Ocorreu um erro ao excluir o usuário.' }
  }
}