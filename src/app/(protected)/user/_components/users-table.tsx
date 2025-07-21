'use client'

import { Prisma, User } from '@prisma/client'
import {Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'


type UserWithTaskCount = User & {
  _count: Prisma.UserCountOutputType
}

export default function UsersTable({ users }: { users: UserWithTaskCount[] }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <>
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Pesquisar por nome..."
            className="w-full rounded-lg border bg-background pl-8 h-10"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('q')?.toString()}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Total de Tarefas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Data de Cadastro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/user/oneUser/${user.id}`}
                    className="group transition-opacity hover:opacity-80"
                  >
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-primary dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {user._count.tasks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          Nenhum usuário encontrado.
        </div>
      )}
    </>
  )
}