import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { Field } from './LoginPage';
const schema=z.object({message:z.string().min(2),amount:z.coerce.number().positive(),currency:z.string().default('RUB')}); type FormInput=z.input<typeof schema>; type Form=z.output<typeof schema>;
export function FraudPage(){const suspicious=useQuery({queryKey:['fraud'],queryFn:bankApi.fraudTransactions}); const form=useForm<FormInput, unknown, Form>({resolver:zodResolver(schema),defaultValues:{currency:'RUB'}}); const check=useMutation({mutationFn:bankApi.fraudCheck}); return <div className="space-y-6"><div className="card bg-ink text-white"><ShieldAlert className="h-10 w-10 text-fintech"/><h2 className="mt-4 text-4xl font-black">Антифрод и LLM checker</h2><p className="mt-2 text-white/60">Backend вызывает fraudulent_checker по HTTP, а при недоступности использует локальную эвристику.</p><Link to="/fraud/transactions" className="btn-secondary mt-6">Подозрительные платежи: {suspicious.data?.length??0}</Link></div><div className="card max-w-2xl"><h3 className="mb-4 text-2xl font-black">Проверить платеж</h3><form className="space-y-4" onSubmit={form.handleSubmit(d=>check.mutate(d))}><Field label="Назначение"><input className="input" {...form.register('message')}/></Field><Field label="Сумма"><input className="input" {...form.register('amount')}/></Field><Field label="Валюта"><input className="input" {...form.register('currency')}/></Field><button className="btn">Анализировать</button></form>{check.data&&<div className="mt-5 rounded-2xl bg-black/5 p-4"><b>Risk score: {check.data.riskScore}</b><p>{check.data.reason}</p><span className="badge">{check.data.source}</span></div>}</div></div>}
