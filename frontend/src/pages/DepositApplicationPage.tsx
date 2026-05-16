import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { Field } from './LoginPage';
const schema=z.object({sourceAccountId:z.coerce.number().positive(),amount:z.coerce.number().min(1000),annualRate:z.coerce.number().positive(),termMonths:z.coerce.number().min(1).max(120)}); type FormInput=z.input<typeof schema>; type Form=z.output<typeof schema>;
export function DepositApplicationPage(){const accounts=useQuery({queryKey:['accounts'],queryFn:bankApi.accounts}); const nav=useNavigate(); const form=useForm<FormInput, unknown, Form>({resolver:zodResolver(schema),defaultValues:{annualRate:0.14,termMonths:12}}); const m=useMutation({mutationFn:bankApi.applyDeposit,onSuccess:()=>nav('/deposits')}); return <div className="card max-w-2xl"><h2 className="mb-5 text-3xl font-black">Открыть вклад</h2><form className="space-y-4" onSubmit={form.handleSubmit(d=>m.mutate(d))}><Field label="Счет"><select className="input" {...form.register('sourceAccountId')}><option value="">Выберите</option>{accounts.data?.map(a=><option value={a.id} key={a.id}>{a.iban}</option>)}</select></Field><Field label="Сумма"><input className="input" {...form.register('amount')}/></Field><Field label="Ставка"><input className="input" {...form.register('annualRate')}/></Field><Field label="Срок"><input className="input" {...form.register('termMonths')}/></Field>{m.error&&<p className="text-red-600">{m.error.message}</p>}<button className="btn">Открыть</button></form></div>}
