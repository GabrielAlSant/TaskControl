import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';


export async function createComment(data: Prisma.CommentUncheckedCreateInput) {
  try {
    const comment = await prisma.comment.create({ data: { ...data, createdAt: new Date() } });
    return { comment };
  } catch (error) {
    return { error };
  }
}


export async function getCommentsByTaskId(taskId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' }, 
    });
    return { comments };
  } catch (error) {
    return { error };
  }
}


export async function updateComment(id: string, data: Prisma.CommentUpdateInput) {
  try {
    const comment = await prisma.comment.update({ where: { id }, data });
    return { comment };
  } catch (error) {
    return { error };
  }
}


export async function deleteComment(id: string) {
  try {
    const comment = await prisma.comment.delete({ where: { id } });
    return { comment };
  } catch (error) {
    return { error };
  }
}