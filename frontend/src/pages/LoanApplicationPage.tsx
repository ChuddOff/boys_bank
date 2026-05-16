import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { Field } from './LoginPage';
const schema=z.object({amount:z.coerce.number().min(1000),termMonths:z.coerce.number().min(1).max(120),annualRate:z.coerce.number().optional(),purpose:z.string().optional()}); type FormInput=z.input<typeof schema>; type Form=z.output<typeof schema>;
export function LoanApplicationPage(){const nav=useNavigate(); const form=useForm<FormInput, unknown, Form>({resolver:zodResolver(schema),defaultValues:{annualRate:18,termMonths:24}}); const m=useMutation({mutationFn:bankApi.applyLoan,onSuccess:()=>nav('/loans')}); return <FormCard title="Заявка на кредит" form={form} submit={(d)=>m.mutate(d)} error={m.error?.message}/>}
export function FormCard({title,form,submit,error}:{title:string;form:any;submit:(d:any)=>void;error?:string}){return <div className="card max-w-2xl"><h2 className="mb-5 text-3xl font-black">{title}</h2><form className="space-y-4" onSubmit={form.handleSubmit(submit)}><Field label="Сумма"><input className="input" {...form.register('amount')}/></Field><Field label="Срок, мес"><input className="input" {...form.register('termMonths')}/></Field><Field label="Ставка"><input className="input" {...form.register('annualRate')}/></Field><Field label="Комментарий"><input className="input" {...form.register('purpose')}/></Field>{error&&<p className="text-red-600">{error}</p>}<button className="btn">Отправить</button></form></div>}
