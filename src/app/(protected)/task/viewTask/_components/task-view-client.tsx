'use client'

import { Comment, Log, Task, User } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { createComment, updateTaskStatus } from '@/app/api/Actions/task.action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type CommentWithUser = Comment & { user: User }
type TaskWithDetails = Task & {
  user: User
  comments: CommentWithUser[]
  logs: Log[]
}

export default function TaskViewClient({ initialTask }: { initialTask: TaskWithDetails }) {
  const [task] = useState(initialTask)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    toast.info('Atualizando status...')
    const result = await updateTaskStatus(task.id, newStatus)
    
    if (result.error) {
      toast.error(result.error)
    } else if (result.task) {
      toast.success('Status atualizado!')
      window.location.reload()
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) {
      toast.warning('O comentário não pode estar vazio.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createComment(task.id, newComment)
      
      if (result.error) {
        toast.error(result.error)
      } else if (result.comment) {
        toast.success('Comentário adicionado.')
        setNewComment('')
       window.location.reload()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{task.title}</CardTitle>
            <CardDescription className="pt-2 text-base text-gray-600 dark:text-gray-300">{task.description}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader><CardTitle>Comentários</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {task.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <div className="flex-1 p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{comment.user.name}</p>
                      <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="text-sm text-foreground/80 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleAddComment} className="w-full flex flex-col gap-2">
              <Textarea placeholder="Adicione um comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} disabled={isSubmitting} />
              <Button type="submit" className="self-end" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Comentar'}</Button>
            </form>
          </CardFooter>
        </Card>
      </div>

      {/* Coluna Lateral */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Detalhes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Criado por</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{task.user.name}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Data de Criação</span>
              <span className="font-semibold">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger><SelectValue placeholder="Selecione um status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="não iniciada">Não iniciada</SelectItem>
                  <SelectItem value="em análise">Em análise</SelectItem>
                  <SelectItem value="concluída">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2 pt-2">
              <span className="text-sm font-medium text-muted-foreground">Histórico de Status</span>
              <div className="border rounded-md p-2 space-y-2 max-h-48 overflow-y-auto">
                {task.logs.map(log => (
                  <div key={log.id} className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">{log.oldStatus}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground"/>
                      <span className="font-semibold bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded">{log.newStatus}</span>
                    </div>
                    <p className="text-muted-foreground pt-1">{new Date(log.date).toLocaleString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}