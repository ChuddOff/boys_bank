import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { LoadingState } from '../shared/components/State';
import { Field } from './LoginPage';
const schema=z.object({firstName:z.string().min(2),lastName:z.string().min(2),email:z.string().email()}); type Form=z.infer<typeof schema>;
export function ProfilePage(){const qc=useQueryClient(); const q=useQuery({queryKey:['profile'],queryFn:bankApi.profile}); const form=useForm<Form>({resolver:zodResolver(schema), values:q.data ? { firstName: q.data.firstName, lastName: q.data.lastName, email: q.data.email } : undefined}); const m=useMutation({mutationFn:bankApi.updateProfile,onSuccess:()=>qc.invalidateQueries({queryKey:['profile']})}); if(q.isLoading)return <LoadingState/>; return <div className="card max-w-2xl"><h2 className="mb-5 text-3xl font-black">Профиль</h2><form className="space-y-4" onSubmit={form.handleSubmit(d=>m.mutate(d))}><Field label="Имя"><input className="input" {...form.register('firstName')}/></Field><Field label="Фамилия"><input className="input" {...form.register('lastName')}/></Field><Field label="Email"><input className="input" {...form.register('email')}/></Field>{m.error&&<p className="text-red-600">{m.error.message}</p>}{m.isSuccess&&<p className="text-green-700">Сохранено</p>}<button className="btn">Сохранить</button></form></div>}
