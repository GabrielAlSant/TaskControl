import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

import UsersTable from './_components/users-table'


export default async function UsuariosPage({
  searchParams,
}: {
  searchParams?: { q?: string }
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/')
  }

  const query = searchParams?.q || ''

  const usersWithTaskCount = await prisma.user.findMany({
    where: {
      name: {
        contains: query,

        mode: 'insensitive',
      },
    }, 

    include: {
      _count: true,
    },

    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
           {' '}
      <div className="flex items-center">
               {' '}
        <h1 className="text-lg font-semibold md:text-2xl">
          Gerenciar Usuários
        </h1>
             {' '}
      </div>
            <UsersTable users={usersWithTaskCount} />   {' '}
    </div>
  )
}
