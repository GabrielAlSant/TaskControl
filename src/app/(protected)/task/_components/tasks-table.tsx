'use client'

import { Task } from '@prisma/client'
import { Pencil, PlusCircle, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import { deleteTask } from '@/app/api/Actions/task.action' 
import { Button } from '@/components/ui/button'

const statusStyles: { [key: string]: string } = {
  concluída: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'em análise':
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'não iniciada':
    'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
}

export default function TasksTable({ tasks }: { tasks: Task[] }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace, refresh } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  async function handleDeleteTask(taskId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      const result = await deleteTask(taskId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Tarefa excluída com sucesso!')
        refresh()
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Pesquisar por título..."
            className="w-full rounded-lg border bg-background pl-8 h-10"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('q')?.toString()}
          />
        </div>
        <Button asChild>
          <Link href="/task/addTask">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Tarefa
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Data de Criação
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/task/viewTask/${task.id}`}
                    className="group"
                  >
                    <div className="text-sm font-medium text-gray-900 group-hover:text-primary dark:text-white">
                      {task.title}
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      statusStyles[task.status] || ''
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/task/altTask/${task.id}`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tasks.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          Nenhuma tarefa encontrada.
        </div>
      )}
    </>
  )
}