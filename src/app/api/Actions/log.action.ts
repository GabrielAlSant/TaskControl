// lib/actions/log.actions.ts

import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';


export async function createLog(data: Prisma.LogUncheckedCreateInput) {
  try {
    const log = await prisma.log.create({ data: { ...data, date: new Date() } });
    return { log };
  } catch (error) {
    return { error };
  }
}


export async function getLogsByTaskId(taskId: string) {
  try {
    const logs = await prisma.log.findMany({
      where: { taskId },
      orderBy: { date: 'desc' }, 
    });
    return { logs };
  } catch (error) {
    return { error };
  }
}


export async function deleteLog(id: string) {
  try {
    const log = await prisma.log.delete({ where: { id } });
    return { log };
  } catch (error) {
    return { error };
  }
}