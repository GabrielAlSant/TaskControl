'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Task } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createTask, updateTask } from '@/app/api/Actions/task.action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter no mínimo 3 caracteres.' }),
  description: z.string().min(1, { message: 'A descrição é obrigatória.' }),
  status: z.enum(['não iniciada', 'em análise', 'concluída']),
})

const statusOptions = ['não iniciada', 'em análise', 'concluída']

interface TaskFormProps {
  task?: Task | null
}

export function TaskForm({ task }: TaskFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false) // Estado de loading manual

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: (task?.status as 'não iniciada' | 'em análise' | 'concluída') || 'não iniciada',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true)
    const result = task ? await updateTask(task.id, values) : await createTask(values)
    setIsPending(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(task ? 'Tarefa atualizada!' : 'Tarefa criada!')
      router.push('/task')
      router.refresh()
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{task ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{statusOptions.map(o=><SelectItem key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push('/task')}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Salvando...' : 'Salvar'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}