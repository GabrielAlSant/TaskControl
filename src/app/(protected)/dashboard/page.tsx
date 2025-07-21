import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const statusStyles: { [key: string]: string } = {
  concluída: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'em análise':
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'não iniciada':
    'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
}

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/')
  }

  const userTasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { id: 'desc' },
  })

  const stats = userTasks.reduce(
    (acc, task) => {
      if (task.status === 'concluída') acc.concluida++
      if (task.status === 'em análise') acc.emAnalise++
      if (task.status === 'não iniciada') acc.naoIniciada++
      return acc
    },
    { concluida: 0, emAnalise: 0, naoIniciada: 0 },
  )

  const recentTasks = userTasks.slice(0, 5)

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-bold">Minha Dashboard</h1>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Tarefas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userTasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Concluídas ✅
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.concluida}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Em Análise ⏳
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.emAnalise}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Não Iniciadas 📝
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.naoIniciada}</div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tarefas Criadas Recentemente</CardTitle>
              </CardHeader>
              <CardContent>
                {recentTasks.length > 0 ? (
                  <ul className="space-y-4">
                    {recentTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground"
                      >
                        <div>
                          <Link
                    href={`../task/viewTask/${task.id}`}
                    className="group"
                  >
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary dark:text-white">{task.title}</p>
                </Link>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            statusStyles[task.status] || ''
                          }`}
                        >
                          {task.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground">
                    Nenhuma tarefa encontrada.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage