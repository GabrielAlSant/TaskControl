'use client'

import { Task, User } from '@prisma/client'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusStyles: { [key: string]: string } = {
  concluída: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'em análise': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'não iniciada': 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
}

interface UserTaskViewProps {
  user: User
  stats: {
    concluida: number
    emAnalise: number
    naoIniciada: number
    total: number
  }
  tasks: Task[]
}

export default function UserTaskView({ user, stats, tasks }: UserTaskViewProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) { params.set('q', term) } else { params.delete('q') }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xl font-bold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Concluídas</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.concluida}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Em Análise</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.emAnalise}</div></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Tarefas</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input type="search" placeholder="Filtrar tarefas por título..." className="w-full rounded-lg border bg-background pl-8 h-9" onChange={(e) => handleSearch(e.target.value)} defaultValue={searchParams.get('q')?.toString()} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Data de Criação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900">
                {tasks.map((task) => (
                  <tr key={task.id}>
                      
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                                        href={`/task/viewTask/${task.id}`}
                                        className="group"
                                      ><div className="text-sm font-medium text-gray-900 group-hover:text-primary dark:text-white">{task.title}</div></Link></td>
                    
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[task.status] || ''}`}>{task.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tasks.length === 0 && ( <div className="py-10 text-center text-gray-500">Nenhuma tarefa encontrada para este filtro.</div> )}
        </CardContent>
      </Card>
    </div>
  )
}