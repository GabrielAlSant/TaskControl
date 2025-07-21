import { PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { customSession } from 'better-auth/plugins'

const prisma = new PrismaClient()
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const taskUser = await prisma.user.findMany({
        where: {
          id: session.userId,
        },
        include: {
          tasks: true,
        },
      })
      const task = taskUser?.[0].tasks?.[0] || undefined
      return {
        user: {
          ...user,
          task,
        },
        session,
      }
    }),
  ],
})
